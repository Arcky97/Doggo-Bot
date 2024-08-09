const { Client, Message } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData.js');

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot) return;

  const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id });
  if (message.channel.id === chatChannelId["chattingChannel"]) {
    try {
      console.log("You sent this message in the correct channel! Woof woof!");
    } catch (error) {
      console.error('Error inserting guild data:', error);
    }
  } else {
    console.log("Message was not sent in the correct channel.");
  }
};