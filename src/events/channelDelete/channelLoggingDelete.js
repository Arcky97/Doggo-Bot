import { Client, GuildChannel, EmbedBuilder } from "discord.js";
import getLogChannel from "../../managers/logging/getLogChannel.js";
import eventTimeoutHandler from "../../handlers/eventTimeoutHandler.js";
import getChannelTypeName from "../../managers/logging/getChannelTypeName.js";
import { getRoleOrChannelBlacklist, getRoleOrChannelMultipliers, setLevelSettings } from "../../managers/levelSettingsManager.js";
import { setChannelOrRoleArray } from '../../utils/setArrayValues.js';
import checkLogTypeConfig from "../../managers/logging/checkLogTypeConfig.js";
import { setBotStats } from "../../managers/botStatsManager.js";

export default async (channel) => {
  const guildId = channel.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'channelDelete' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({guildId: guildId, type: 'server', cat: 'channels', option: 'deletes' });
    if (!configLogging) return;

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