const { Client, Message } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData');
const { getReplies, findClosestMatch, getTriggers } = require('../../../database/botReplies/setBotReplies');

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot) return;
  try {
    const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id });
    if (!chatChannelId) return;

    if (chatChannelId['chattingChannel'] && message.channel.id === chatChannelId['chattingChannel']) {
      try {
        let replies = await getReplies();
        let closestMatches = await findClosestMatch(message.content, await getTriggers());
        if (closestMatches && closestMatches.matches.length > 0 && closestMatches.color !== 0xED4245) {
          const matchingResponse = replies.find(reply => 
            reply.triggers.some(trigger => closestMatches.matches[0] === trigger)
          );
          if (matchingResponse) {
            const responses = matchingResponse.responses;
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            message.channel.send(randomResponse);
          } else {
            console.log('No close match found!');
          }
        } 
      } catch (error) {
        console.error('Error retrieving response:', error);
      }
    }
  } catch (error) {
    console.error('Error getting GuildSettings values from database:', error);
  }
}