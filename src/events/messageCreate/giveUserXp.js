const { Client, Message } = require('discord.js');
const { getChannel } = require('./../../../database/selectData.js');

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot) return;

  const chatChannelId = await getChannel(message.guild.id, "botchat");
  if (message.channel.id === chatChannelId) {
    try {
      console.log("You sent this message in the correct channel! Woof woof!");
    } catch (error) {
      console.error('Error inserting guild data:', error);
    }
  } else {
    console.log("Message was not sent in the correct channel.");
  }
};