const { Client, GuildChannel, EmbedBuilder } = require("discord.js");
const getLogChannel = require("../../managers/logging/getLogChannel");
const eventTimeoutHandler = require("../../handlers/eventTimeoutHandler");
const getChannelTypeName = require("../../managers/logging/getChannelTypeName");
const { getRoleOrChannelBlacklist, getRoleOrChannelMultipliers, setLevelSettings } = require("../../managers/levelSettingsManager");
const { setChannelOrRoleArray } = require('../../utils/setArrayValues');
const checkLogTypeConfig = require("../../managers/logging/checkLogTypeConfig");
const { setBotStats } = require("../../managers/botStatsManager");

module.exports = async (channel) => {
  const guildId = channel.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'channelDelete' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const loggingConfig = await checkLogTypeConfig({guildId: guildId, type: 'server', cat: 'channels', option: 'deletes' });
    if (!loggingConfig) return;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(`${getChannelTypeName(channel)} Deleted`)
      .setFields(
        {
          name: 'Name',
          value: channel.name 
        },
        {
          name: 'Category',
          value: `${channel.parent?.name || 'None'}`
        }
      )
      .setFooter({
        text: `Channel ID: ${channel.id}`
      })
      .setTimestamp()

    const blackListChannels = await getRoleOrChannelBlacklist({ id: channel.guild.id, type: 'channel' });
    const chanMults = await getRoleOrChannelMultipliers({ id: channel.guild.id, type: 'channel' });
    const blackListCategories = await getRoleOrChannelBlacklist({ id: channel.guild.id, type: 'channel' });
    const catMults = await getRoleOrChannelMultipliers({ id: channel.guild.id, type: 'channel'});

    if (getChannelTypeName(channel) === 'Category') {
      [_, setData] = setChannelOrRoleArray({ type: 'category', data: blackListCategories, id: channel.id, remove: true });
      await setLevelSettings({ id: channel.guild.id, setting: { 'blackListCategories': setData } });
      [_, setData] = setChannelOrRoleArray({ type: 'category', data: catMults, id: channel.id, remove: true });
      await setLevelSettings({ id: channel.guild.id, setting: { 'categoryMultipliers': setData } });
    } else {
      let [_, setData] = setChannelOrRoleArray({ type: 'channel', data: blackListChannels, id: channel.id, remove: true });
      await setLevelSettings({ id: channel.guild.id, setting: { 'blackListChannels': setData } });
      [_, setData] = setChannelOrRoleArray({ type: 'channel', data: chanMults, id: channel.id, remove: true });
      await setLevelSettings({ id: channel.guild.id, setting: { 'channelMultipliers': setData } });  
    }
    await eventTimeoutHandler('channel', channel.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Channel Delete!', error);
  }
}