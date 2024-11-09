const { Client, GuildEmoji, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, oldEmoji, newEmoji) => {
  try {
    const logChannel = await getLogChannel(client, oldEmoji.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}