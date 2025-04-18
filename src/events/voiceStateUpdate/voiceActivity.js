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
const { getGuildLoggingConfig } = require('../../managers/guildSettingsManager');
const { botStartTime } = require('../..');
const voiceActivity = new Map();

module.exports = async (oldState, newState) => {
  const guildId = oldState.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'voiceActivity' });

    const logChannel = await getLogChannel(oldState.guild.id, 'voice');
    if (!logChannel) return;

    if (await ignoreLogging(oldState.guild.id, logChannel.id)) return;

    const levelSettings = await getLevelSettings(oldState.guild.id);

    const configLogging = await getGuildLoggingConfig(guildId, 'voice');
    if (configLogging.length === 0) return;

    let embed = new EmbedBuilder()
      .setAuthor({
        name: newState.member.user.globalName,
        iconURL: newState.member.user.avatarURL()
      })
      .setFooter({
        text: `User ID: ${newState.member.user.id}`
      })
      .setTimestamp()

    // VC join
    if (oldState.channelId === null && newState.channelId !== null) {
      if (!configLogging.joins) return;
      embed.setColor('Green');
      embed.setTitle('Voice Channel Join');
      embed.setFields(
        {
          name: 'Channel',
          value: newState.channel.name
        }
      )
      voiceActivity.set(newState.guild.id + newState.member.id, Date.now());
    // VC change or leave
    } else if (oldState.channelId !== newState.channelId) {
      const joinTime = voiceActivity.get(newState.guild.id + newState.member.id) || botStartTime;
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
      // VC leave
      if (oldState.channelId !== null && newState.channelId === null) {
        if (!configLogging.leaves) return;
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
      // VC change
      } else if (oldState.channelId !== newState.channelId) {
        if (!configLogging.moves) return;
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
    // (server) Deaf/mute
    } else {
      if (oldState.selfMute !== newState.selfMute) {
        if (!oldState.selfMute && newState.selfMute) {
          if (!configLogging.mutes) return;
          embed.setColor('#ff039a');
          embed.setTitle('Member Muted');
        }
        if (oldState.selfMute && !newState.selfMute) {
          if (!configLogging.unmutes) return;
          embed.setColor('#34eb8f');
          embed.setTitle('Member Unmuted');
        }
      } else if (oldState.selfDeaf !== newState.selfDeaf) {
        if (!oldState.selfDeaf && newState.selfDeaf ) {
          if (!configLogging.deafens) return;
          embed.setColor('#ff039a');
          embed.setTitle('Member Deafened');
        }
        if (oldState.selfDeaf && !newState.selfDeaf) {
          if (!configLogging.undeafens) return;
          embed.setColor('#34eb8f');
          embed.setTitle('Member UnDeafened');
        }
      } else if (oldState.serverMute !== newState.serverMute) {
        if (!oldState.serverMute && newState.serverMute) {
          if (!configLogging.mutes) return;
          embed.setColor('#870051');
          embed.setTitle('Member Server Muted');
        } 
        if (oldState.serverMute && !newState.serverMute) {
          if (!configLogging.unmutes) return;
          embed.setColor('#008736');
          embed.setTitle('Member Server Unmuted');
        }
      } else if (oldState.serverDeaf !== newState.serverDeaf) {
        if (!oldState.serverDeaf && newState.serverDeaf) {
          if (!configLogging.deafens) return;
          embed.setColor('#870051');
          embed.setTitle('Member Server Deafened');
        }
        if (oldState.serverDeaf && !newState.serverDeaf) {
          if (!configLogging.undeafens) return;
          embed.setColor('#008736');
          embed.setTitle('Member Server Undeafened');
        }
      }
    }
    
    await eventTimeoutHandler('voice', newState.member.user.id, embed, logChannel);
  } catch (error) {
    console.error('Failed to log Voice Activity', error);
  }
}