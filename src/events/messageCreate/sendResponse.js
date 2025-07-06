import { Client, Message } from 'discord.js';
import { selectData } from '../../services/database/selectData.js';
import { getReplies, findClosestMatch, getTriggers } from '../../managers/botRepliesManager.js';

export default async (message) => {
  if (message.author.bot) return;
  try {
    let chatChannelId;
    if (message.inGuild()) {
      const getData = await selectData('GuildSettings', {guildId: message.guildId });
      chatChannelId = getData['chattingChannel']
    } else {
      chatChannelId = message.channel.id;
    }
    if (!chatChannelId) return;
    if (chatChannelId && message.channel.id === chatChannelId) {
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