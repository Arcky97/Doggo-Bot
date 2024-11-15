const { Client, ThreadChannel, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');

module.exports = async (client, oldThread, newThread) => {
  try { 
    const logChannel = await getLogChannel(client, oldThread.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}