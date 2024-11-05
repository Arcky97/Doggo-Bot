const { Client, VoiceState } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');
const ignoreLogging = require('../../utils/ignoreLogging');

module.exports = async (client, oldState, newState) => {
  try {
    const channel = await getLogChannel(client, oldState.guild.id, 'voice');
    if (!channel) return;

    if (await ignoreLogging(oldState.guild.id, channel.id)) return;

    if (oldState.channelId === null && newState.channelId !== null) {
      console.log(`${newState.member.user.tag} joined ${newState.channel.name}`);
    } else if (oldState.channelId !== null && newState.channelId === null) {
      console.log(`${newState.member.user.tag} left ${oldState.channel.name}`);
    } else if (oldState.channelId !== newState.channelId) {
      console.log(`${newState.member.user.tag} moved from ${oldState.channel.name} to ${newState.channel.name}`);
      return;
    }
  
    if (oldState.selfMute !== newState.selfMute) {
      console.log(`${newState.member.user.tag} has ${newState.selfMute ? 'muted' : 'unmuted'} themselves`);
      return;
    }
    
    if (oldState.selfDeaf !== newState.selfDeaf) {
      console.log(`${newState.member.user.tag} has ${newState.selfDeaf ? 'deafened' : 'undeafened'} themselves`);
      return;
    }

  } catch (error) {
    console.error('Failed to log Voice Activity', error);
  }
}