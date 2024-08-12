const { Client, Message } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData');
const { getReplies, findClosestMatch, getTriggers } = require('../../../database/triggerResponses/setTriggerResponses');

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot) return;

  const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id });
  if (message.channel.id === chatChannelId["chattingChannel"]) {
    try {
      let responses = await getReplies();
      let closestMatches = await findClosestMatch(message.content, await getTriggers());
      if (closestMatches && closestMatches.matches.length > 0) {
        const matchingResponse = responses.find(response => 
          response[1] === closestMatches.matches[0]
        );
        if (matchingResponse) {
          const responses = JSON.parse(matchingResponse[2]);
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          message.channel.send(randomResponse);
        } else {
          console.log("No close match found!")
        }
      } 
    } catch (error) {
      console.error('Error retrieving response:', error);
    }
  }
}