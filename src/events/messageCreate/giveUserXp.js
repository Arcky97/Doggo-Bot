const { Client, Message } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData.js');

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot) return;

  const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id });
  if (message.channel.id === chatChannelId["chattingChannel"]) {
    try {
      
    } catch (error) {
      console.error('Error inserting guild data:', error);
    }
  }
};