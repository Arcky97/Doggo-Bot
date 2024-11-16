const { Client, VoiceState, EmbedBuilder, GuildWidgetStyle } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const ignoreLogging = require('../../utils/logging/ignoreLogging');
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const { getLevelSettings, getXpSettings, getAnnounceChannel, getAnnouncePing } = require('../../../database/levelSystem/setLevelSettings');
const calculateVoiceXp = require('../../utils/levels/calculateVoiceXp');
const formatTime = require('../../utils/formatTime');
const { getUserLevel, setUserLevelInfo } = require('../../../database/levelSystem/setLevelSystem');
const calculateXpByLevel = require('../../utils/levels/calculateXpByLevel');
const calculateLevelByXp = require('../../utils/levels/calculateLevelByXp');
const createAnnounceEmbed = require('../../utils/levels/createAnnounceEmbed');
const giveUserLevelRole = require('../../utils/levels/giveUserLevelRole');
const voiceActivity = new Map();

module.exports = async (client, oldState, newState) => {
  try {
    const logChannel = await getLogChannel(client, oldState.guild.id, 'voice');
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
      console.log(`${newState.member.user.tag} joined ${newState.channel.name}`);
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
          const totalXp = await calculateVoiceXp(newState.guild.id, secondsSpent);
          const xpSettings = await getXpSettings(newState.guild.id);
          const userLevelInfo = await getUserLevel(newState.guild.id, newState.member.id);
          if (userLevelInfo) {
            const newXp = userLevelInfo.xp + totalXp;
            const newLevel = calculateLevelByXp(newXp, xpSettings);
            const userInfo = {
              level: newLevel,
              xp: newXp,
              color: userLevelInfo.color 
            }
            await setUserLevelInfo(userLevelInfo, { guildId: newState.guild.id, memberId: newState.member.id }, { level: newLevel, xp: newXp });
            let levelEmbed = await createAnnounceEmbed(newState.guild.id, newState, userInfo);
            if (userLevelInfo.level !== userInfo.level) {
              const channel = client.channels.cache.get(await getAnnounceChannel(newState.guild.id));
              const ping = await getAnnouncePing(newState.guild.id) === 1 ? `<@${newState.member.id}>` : '';
              await channel.send({content: ping, embeds: [levelEmbed] });
              await giveUserLevelRole(newState.guild.id, newState.member, userInfo);
            }
          }
        } else {
          console.log('Was in AFK channel so no xp will be earned.');
        }
      }
      const joinDate = new Date(joinTime);
      if (oldState.channelId !== null && newState.channelId === null) {
        console.log(`${newState.member.user.tag} left ${oldState.channel.name}`);
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
        console.log(`${newState.member.user.tag} moved from ${oldState.channel.name} to ${newState.channel.name}`);
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
    

    await setEventTimeOut('voice', newState.member.user.id, embed, logChannel);
  } catch (error) {
    console.error('Failed to log Voice Activity', error);
  }
}