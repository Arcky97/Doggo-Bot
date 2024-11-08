const { Client, DMChannel, EmbedBuilder } = require('discord.js');
const getLogChannel = require("../../utils/getLogChannel");
const setEventTimeOut = require("../../handlers/setEventTimeOut");


module.exports = async (client, oldChannel, newChannel) => {
  try {
    
    const logChannel = await getLogChannel(client, oldChannel.guild.id, 'server');
    if (!logChannel) return;

    let embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle(`Channel Update: ${oldChannel}`)

    let beforeSettings = afterSettings = '';
    if (oldChannel.name !== newChannel.name) {
      beforeSettings += `**Name:** ${oldChannel.name}\n`;
      afterSettings += `**Name:** ${newChannel.name}\n`;
    }

    if (oldChannel.parentId !== newChannel.parentId) {
      beforeSettings += `**Category:** ${oldChannel.parent?.name || 'None'}\n`;
      afterSettings += `**Category:** ${newChannel.parent?.name || 'None'}\n`;
    }

    if (oldChannel.topic !== newChannel.topic) {
      beforeSettings += `**Topic:** ${oldChannel.topic || 'None'}\n`;
      afterSettings += `**Topic:** ${newChannel.topic || 'None'}\n`;
    }

    if (oldChannel.nsfw !== newChannel.nsfw) {
      beforeSettings += `**Age-Restricted:** ${oldChannel.nsfw}\n`;
      afterSettings += `**Age-Restricted: ** ${newChannel.nsfw}\n`;
    }

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
      beforeSettings += `**Slow Mode:** ${oldChannel.rateLimitPerUser} Seconds\n`;
      afterSettings += `**Slow Mode:** ${newChannel.rateLimitPerUser} Seconds\n`;
    }

    if (beforeSettings !== '' || afterSettings !== '') {
      embed.addFields(
        {
          name: 'Before',
          value: beforeSettings || 'nothing',
          inline: true 
        },
        {
          name: 'After',
          value: afterSettings || 'Who knows what',
          inline: true 
        }
      );
    }
    
    embed.setFooter({
      text: `Channel ID: ${newChannel.id}`
    })
    .setTimestamp()
    await setEventTimeOut('channel', newChannel.id, embed, logChannel);

    console.log(`The Channel ${newChannel} with ID: ${newChannel.id} was updated in Server ${newChannel.guild.id}.`);

  } catch (error) {
    console.error('Failed to log Channel Update!', error);
  }
}