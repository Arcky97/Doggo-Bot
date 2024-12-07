const { Client, Sticker, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, oldSticker, newSticker) => {
  const guildId = oldSticker.guild.id;
  try {
    const logChannel = await getLogChannel(client, guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'stickers', option: 'updates' });
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Sticker Updated')
      
    let beforeSettings = afterSettings = '';
    if (oldSticker.name !== newSticker.name) {
      beforeSettings += `**Name:** ${oldSticker.name}`;
      afterSettings += `**Name:** ${newSticker.name}`;
    }

    if (oldSticker.description !== newSticker.description) {
      beforeSettings += `**Description:** \n${oldSticker.description}`;
      afterSettings += `**Description:** \n${newSticker.description}`;
    }

    if (beforeSettings !== '' || afterSettings !== '') {
      embed.addFields(
        {
          name: 'Before',
          value: afterSettings || 'nothing',
          inline: true 
        },
        {
          name: 'After',
          value: afterSettings || 'who knows what',
          inline: true 
        }
      );
    }

    embed.setFooter({
      text: `Sticker ID: ${oldSticker.id}`
    })
    .setTimestamp()

    if (embed.addFields.length < 1) return;

    await setEventTimeOut('server', oldSticker.id, embed, logChannel);
    
  } catch (error) {
    console.error('Failed to log Sticker Update!', error);
  }
}