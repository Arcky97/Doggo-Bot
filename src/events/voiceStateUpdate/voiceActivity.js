const { Client, VoiceState } = require('discord.js');

module.exports = async (client, oldState, newState) => {
  if (oldState.channelId === null && newState.channelId !== null) {
    console.log(`${newState.member.user.tag} joined ${newState.channel.name}`);
  }

  if (oldState.channelId !== null && newState.channelId === null) {
    console.log(`${newState.member.user.tag} left ${newState.channel.name}`);
  }

  if (oldState.channelId !== newState.channelId) {
    console.log(`${newState.member.user.tag} moved from ${oldState.channel.name} to ${newState.channel.name}`);
  }

  if (oldState.selfMute !== newState.selfMute) {
    console.log(`${newState.member.user.tag} has ${newState.selfMute ? 'muted' : 'unmuted'} themselves`);
  }
  
  if (oldState.selfDeaf !== newState.selfDeaf) {
    console.log(`${newState.member.user.tag} has ${newState.selfDeaf ? 'deafened' : 'undeafened'} themselves`);
  }
}