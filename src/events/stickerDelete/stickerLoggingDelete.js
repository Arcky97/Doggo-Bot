const { Client, Sticker, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, sticker) => {
  try {
    const logChannel = await getLogChannel(client, sticker.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}
