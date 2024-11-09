const { Client, VoiceState, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');
const ignoreLogging = require('../../utils/ignoreLogging');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, oldState, newState) => {
  try {
    const logChannel = await getLogChannel(client, oldState.guild.id, 'voice');
    if (!logChannel) return;

    if (await ignoreLogging(oldState.guild.id, channel.id)) return;

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
    } else if (oldState.channelId !== null && newState.channelId === null) {
      console.log(`${newState.member.user.tag} left ${oldState.channel.name}`);
      embed.setColor('Red');
      embed.setTitle('Voice Channel Leave');
      embed.setFields(
        {
          name: 'Channel',
          value: oldState.channel.name
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
        }
      )
    }
  
    if (oldState.selfMute !== newState.selfMute) {
      console.log(`${newState.member.user.tag} has ${newState.selfMute ? 'muted' : 'unmuted'} themselves`);
      embed.setColor(newState.selfMute ? 'Red' : 'Green');
      embed.setTitle(`Member ${newState.selfMute ? 'Muted' : 'Unmuted'}`);
      embed.setFields(
        {
          name: 'Channel',
          value: newState.channel.name
        }
      )
    }
    
    if (oldState.selfDeaf !== newState.selfDeaf) {
      console.log(`${newState.member.user.tag} has ${newState.selfDeaf ? 'deafened' : 'undeafened'} themselves`);
      embed.setColor(newState.selfDeaf ? 'Red' : 'Green');
      embed.setTitle(`Member ${newState.selfDeaf ? 'Deafened' : 'Undeafened'}`);
      embed.setFields(
        {
          name: 'Channel',
          value: newState.channel.name 
        }
      )
    }

    await setEventTimeOut('voice', newState.member.user.id, embed, logChannel);
  } catch (error) {
    console.error('Failed to log Voice Activity', error);
  }
}