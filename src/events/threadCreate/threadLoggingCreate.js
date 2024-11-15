const { Client, ThreadChannel, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');

module.exports = async (client, thread, newlyCreated) => {
  try {
    const logChannel = await getLogChannel(client, thread.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}