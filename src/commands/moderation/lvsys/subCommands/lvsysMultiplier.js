const getMultiplierSettings = require("../../../../managers/levels/getMultiplierSettings");
const { getRoleOrChannelMultipliers } = require("../../../../managers/levelSettingsManager");
const getChannelTypeName = require("../../../../managers/logging/getChannelTypeName");
const { createSuccessEmbed, createWarningEmbed, createInfoEmbed } = require("../../../../services/embeds/createReplyEmbed");
const createListFromArray = require("../../../../utils/createListFromArray");
const firstLetterToUpperCase = require("../../../../utils/firstLetterToUpperCase");
const { setChannelOrRoleArray } = require("../../../../utils/setArrayValues");

module.exports = async (interaction, guildId, subCmdGroup, subCmd, value, levSettings) => {
  let data, setting, embed, action, setData;
  value = Math.round(value * 100);
  const replace = interaction.options.getBoolean('replace') || false;
  if (subCmd !== 'global' && subCmd !== 'settings' && subCmd !== 'replace') {
    data = await getRoleOrChannelMultipliers({ id: guildId, type: subCmd }) || [];
  }
  switch(subCmd) {
    // global multiplier
    case 'global':
      // new value not same with current value
      if (levSettings.globalMultiplier !== value) {
        setting = { 'globalMultiplier': value };
        embed = createSuccessEmbed({
          int: interaction,
          title: 'Global Multiplier set!',
          descr: `The Global Multiplier has been set to \`${value}%\`!`
        });
      // new value is same with current value
      } else {
        embed = createInfoEmbed({
          int: interaction,
          title: 'Global Multiplier not set!',
          descr: `The Global Multiplier has already been set to \`${value}%\`! If you wish to change it, try another value.`
        });
      }
      break;
    // channel and category multiplier
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
            title: 'Multiplier not set!',
            descr: `${channel} is not a ${firstLetterToUpperCase(subCmd)}. \nPlease use \`/lvsys ${subCmdGroup} ${subCmd === 'channel' ? 'category' : 'channel' }\` instead.`
          });
        // channel given is not afk channel
        } else if (interaction.guild.afkChannelId !== channel.id) {
          [action, setData] = setChannelOrRoleArray({ 
                              type: subCmd, 
                              data: data, 
                              id: channel.id, 
                              value: value, 
                              replace: replace 
                            });
          setting = { [`${subCmd}Multipliers`]: setData };
          embed = createSuccessEmbed({
            int: interaction,
            title: `${firstLetterToUpperCase(subCmd)} Multiplier ${action}!`,
            descr: `The ${firstLetterToUpperCase(subCmd)} Multiplier for ${channel} has been ${action !== 'removed' ? `set to \`${value}%\`` : action}! ${action !== 'removed' ? `\nThe ${firstLetterToUpperCase(subCmd)} Multiplier will ${replace ? 'now replace' : 'stack up with'} the ${subCmd === 'channel' ? 'Category/Global' : 'Global' } Multiplier.`: ''}`
          });
        // channel given is afk channel
        } else {
          embed = createWarningEmbed({
            int: interaction,
            title: 'Multiplier not set!',
            descr: `${channel} is set as AFK Voice Channel for this Server and can't have a multiplier. \n(You can't earn XP there anyway.)`
          });
        }
      // given channel type is not category, text or voice
      } else {
        embed = createWarningEmbed({
          int: interaction,
          title: 'Channel Type not supported!',
          descr: `Setting a Channel Multiplier for ${channelTypeName} is not supported!`
        });
      }
      break;
    // role multiplier
    case 'role':
      const role = interaction.options.getRole('name');
      // role is not @everyone or @here
      if (role.id !== guildId) {
        [action, setData] = setChannelOrRoleArray({
                            type: 'role',
                            data: data,
                            id: role.id,
                            value: value 
                          });
        setting = { 'roleMultipliers': setData };
        embed = createSuccessEmbed({
          int: interaction,
          title: `Role Multiplier ${action}!`,
          descr: `The ${subCmd} ${subCmdGroup} for ${role} has been ${action !== 'removed' ? `set to \`${value}%\`` : action }!`
        });
      // role is not valid
      } else {
        embed = createWarningEmbed({
          int: interaction, 
          descr: `A Role Multiplier can't be set for ${role}.`
        });
      }
      break;
    // multiplier replace settings
    case 'replace':
      const catRepl = interaction.options.getBoolean('category');
      const chanRepl = interaction.options.getBoolean('channel');
      const multRepl = JSON.parse(levSettings.multiplierReplace);
      if (catRepl !== multRepl.category || chanRepl !== multRepl.channel) {
        setData = JSON.stringify({
          'category': catRepl,
          'channel': chanRepl
        });
        setting = { 'multiplierReplace': setData };
        embed = createSuccessEmbed({
          int: interaction,
          title: 'Multiplier Settings updated!',
          descr: `The Category and Channel Multiplier Replace Settings have been updated! \n- category: ${catRepl} \n- channel: ${chanRepl}!`
        });
      } else {
        embed = createInfoEmbed({
          int: interaction,
          title: 'Multiplier Settings not updated!',
          descr: `The Category and Channel Multipliers have not been updated.`
        })
      }
      break;
    // show multiplier settings
    case 'settings':
      const globalMult = levSettings.globalMultiplier;
      const roleMults = createListFromArray(levSettings.roleMultipliers, '- `${value}%` - <@&${roleId}>');
      const channelMults = createListFromArray(levSettings.channelMultipliers, '- `${value}%` - <#${channelId}>');
      const categoryMults = createListFromArray(levSettings.categoryMultipliers, '- `${value}%` - <#${categoryId}>');
      embed = getMultiplierSettings(levSettings, globalMult, roleMults, channelMults, categoryMults);
      break;
  }
  return { setting, embed };
};