const getBlacklistSettings = require("../../../../managers/levels/getBlacklistSettings");
const { getRoleOrChannelBlacklist } = require("../../../../managers/levelSettingsManager");
const getChannelTypeName = require("../../../../managers/logging/getChannelTypeName");
const { createWarningEmbed, createSuccessEmbed } = require("../../../../services/embeds/createReplyEmbed");
const createListFromArray = require("../../../../utils/createListFromArray");
const firstLetterToUpperCase = require("../../../../utils/firstLetterToUpperCase");
const getVowel = require("../../../../utils/getVowel");
const { setChannelOrRoleArray } = require("../../../../utils/setArrayValues");

module.exports = async (interaction, guildId, subCmdGroup, subCmd, levSettings) => {
  let setting, embed, action, setData;
  const data = await getRoleOrChannelBlacklist({ id: guildId, type: subCmd });
  switch(subCmd) {
    case 'channel':
    case 'category':
      const channel = interaction.options.getChannel('name');
      const channelTypeName = getChannelTypeName(channel);
      // channel type is either a category, text or voice channel
      if ([0, 2, 4].some(type => type === channel.type)) {
        // check correct command usage
        if (
          (subCmd === 'channel' && channel.type === 4) || 
          (subCmd === 'category' && (channel.type === 2 || channel.type === 0))
        ) {
          embed = createWarningEmbed({
            int: interaction, 
            title: 'Black List not updated!',
            descr: `${channel} is not a ${firstLetterToUpperCase(subCmd)}. \nPlease use \`lvsys ${subCmdGroup} ${subCmd === 'channel' ? 'category' : 'channel'}\` instead.`
          });
        // channel given is not afk channel
        } else if (interaction.guild.afkChannelId !== channel.id) {
          [action, setData] = setChannelOrRoleArray({ 
                              type: subCmd, 
                              data: data,
                              id: channel.id
                            });
          setting = { [`blackList${subCmd === 'channel' ? `${firstLetterToUpperCase(subCmd)}s` : `${subCmd.replace(/y$/, 'ies')}`}`]: setData };
          embed = createSuccessEmbed({
            int: interaction,
            title: `${firstLetterToUpperCase(subCmd)} ${action}!`,
            descr: `${channel} has been ${action} to the Black List`
          });
        // channel given is afk channel
        } else {
          embed = createWarningEmbed({
            int: interaction, title: 'Black List not updated!',
            descr: `Adding ${channel} to the Black List will have no effect as this Voice Channel is set as the AFK Channel for this Server. You can't earn XP in the AFK Voice Channel anyways.`
          });
        }
      // given channel type is not category, text or voice
      } else {
        embed = createWarningEmbed({
          int: interaction,
          title: 'Channel Type not supported!',
          descr: `You can't add ${getVowel(channelTypeName)} to the ${firstLetterToUpperCase(subCmd)} Black List.`
        });
      }
      break;
    case 'role':
      const role = interaction.options.getRole('name');
      // role is not @everyone or @here
      if (role.id !== guildId) {
        [action, setData] = setChannelOrRoleArray({
                            type: 'role',
                            data: data,
                            id: role.id     
                          });
        setting = { 'blackListRoles': setData };
        embed = createSuccessEmbed({
        int: interaction,
        title: `Role ${action}!`,
        descr: `${role} has been ${action} to the Black List.`
        });
      // role is not valid
      } else {
        embed = createWarningEmbed({
          int: interaction,
          descr: `${role} cannont be added to the Black List.`
        });
      }
      break;
    case 'settings':
      const blackListRoles = createListFromArray(levSettings.blackListRoles, '- <@&${roleId}>');
      const blackListChannels = createListFromArray(levSettings.blackListChannels, '- <#${channelId}>');
      const blackListCategories = createListFromArray(levSettings.blackListCategories, '- <#${categoryId}>');
      embed = getBlacklistSettings(blackListRoles, blackListChannels, blackListCategories);
      break;
  }
  return { setting, embed };
};