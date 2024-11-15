const { Client, Sticker, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');

module.exports = async (client, oldSticker, newSticker) => {
  try {
    const logChannel = await getLogChannel(client, oldSticker.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}