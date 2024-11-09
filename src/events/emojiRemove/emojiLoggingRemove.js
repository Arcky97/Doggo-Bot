const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, emoji) => {
  try {
    const logChannel = await getLogChannel(client, emoji.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}