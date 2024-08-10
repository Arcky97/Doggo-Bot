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
      console.log(closestMatches)
      if (closestMatches.matches.length > 0) {
        const matchingResponse = responses.find(response => 
          response[1] === closestMatches.matches[0]
        );

        if (matchingResponse) {
          const reply = matchingResponse[2];
          if (reply.length > 0) {
            const responseToSend = Array.isArray(reply) ? reply[Math.floor(Math.random() * reply.length)] : reply; 
            message.channel.send(responseToSend);
          }
        } else {
          console.log("No close match found!")
        }
      } 
    } catch (error) {
      console.error('Error retrieving response:', error);
    }
  }
}