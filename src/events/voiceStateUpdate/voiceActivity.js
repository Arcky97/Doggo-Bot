const { Client, VoiceState, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const ignoreLogging = require('../../managers/logging/ignoreLogging');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const { getLevelSettings, getXpSettings } = require('../../managers/levelSettingsManager');
const getVoiceXp = require('../../managers/levels/getVoiceXp');
const formatTime = require('../../utils/formatTime');
const giveUserLevelRole = require('../../managers/levels/giveUserLevelRole');
const sendAnnounceMessage = require('../../managers/levels/sendAnnounceMessage');
const getUserInfo = require('../../managers/levels/getUserInfo');
const { setBotStats } = require('../../managers/botStatsManager');
const voiceActivity = new Map();

module.exports = async (oldState, newState) => {
  const guildId = oldState.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'voiceActivity' });

    const logChannel = await getLogChannel(oldState.guild.id, 'voice');
    if (!logChannel) return;

    if (await ignoreLogging(oldState.guild.id, logChannel.id)) return;

    const levelSettings = await getLevelSettings(oldState.guild.id);

    let embed = new EmbedBuilder()
      .setAuthor({
        name: newState.member.user.globalName,
        iconURL: newState.member.user.avatarURL()
      })
      .setFooter({
        text: `User ID: ${newState.member.user.id}`
      })
      .setTimestamp()

    if (oldState.channelId === null && newState.channelId !== null) {
      embed.setColor('Green');
      embed.setTitle('Voice Channel Join');
      embed.setFields(
        {
          name: 'Channel',
          value: newState.channel.name
        }
      )
      voiceActivity.set(newState.guild.id + newState.member.id, Date.now());
    } else {
      const joinTime = voiceActivity.get(newState.guild.id + newState.member.id);
      if (joinTime) {
        const timeSpent = Date.now() - joinTime;
        voiceActivity.delete(newState.guild.id + newState.member.id);
        const secondsSpent = Math.floor(timeSpent / 1000); // convert to seconds
        if (levelSettings.voiceEnable && newState.guild.afkChannelId !== oldState.channel.id) {
          const xpToGive = await getVoiceXp(newState.guild.id, oldState.channel, secondsSpent);
          const xpSettings = await getXpSettings(newState.guild.id);
          const userInfo = await getUserInfo(newState.guild.id, newState.member, xpToGive, xpSettings);
          if (userInfo) {
            await sendAnnounceMessage(newState, newState.member, userInfo);
            await giveUserLevelRole(newState.guild.id, newState.member, userInfo);
          }
        }
      }
      const joinDate = new Date(joinTime);
      if (oldState.channelId !== null && newState.channelId === null) {
        embed.setColor('Red');
        embed.setTitle('Voice Channel Leave');
        embed.setFields(
          {
            name: 'Channel',
            value: oldState.channel.name
          },
          {
            name: 'Time Spent',
            value: await formatTime(joinDate.toISOString())
          }
        )
      } else if (oldState.channelId !== newState.channelId) {
        embed.setColor('Orange');
        embed.setTitle('Voice Channel Change');
        embed.setFields(
          {
            name: 'Old Channel',
            value: oldState.channel.name 
          },
          {
            name: 'New Channel',
            value: newState.channel.name
          },
          {
            name: 'Time Spent',
            value: await formatTime(joinDate.toISOString())
          }
        )
        voiceActivity.set(newState.guild.id + newState.member.id, Date.now());
      }
    } 
    

    await eventTimeoutHandler('voice', newState.member.user.id, embed, logChannel);
  } catch (error) {
    console.error('Failed to log Voice Activity', error);
  }
}