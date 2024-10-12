const { Client, Message } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData');

module.exports = async (client, message) => {
  if (!message.inGuild() || !message.author || message.author.bot || message.guild.id !== '925765418545741854') return;

  try {
    const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id})

    if (!chatChannelId) return;

    if (message.channel.id === chatChannelId["chattingChannel"]) {
      await message.react('<:ISeeYou:949790258952798289>');
    };
  } catch (error) {
    console.error('There was an error retrieving GuildSettings from the database:', error);
  }
}