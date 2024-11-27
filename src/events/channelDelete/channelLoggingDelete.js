const { Client, GuildChannel, EmbedBuilder } = require("discord.js");
const getLogChannel = require("../../utils/logging/getLogChannel");
const setEventTimeOut = require("../../handlers/setEventTimeOut");
const getChannelTypeName = require("../../utils/logging/getChannelTypeName");
const { getRoleOrChannelBlacklist, getRoleOrChannelMultipliers, setLevelSettings } = require("../../../database/levelSystem/setLevelSettings");
const { setChannelOrRoleArray } = require('../../utils/setArrayValues');

module.exports = async (client, channel) => {
  try {
    const logChannel = await getLogChannel(client, channel.guild.id, 'server');
    if (!logChannel) return;

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
    await setEventTimeOut('channel', channel.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Channel Delete!', error);
  }
}