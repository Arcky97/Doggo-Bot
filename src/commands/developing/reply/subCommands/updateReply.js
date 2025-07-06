import { EmbedBuilder } from "discord.js";
import { createErrorEmbed } from '../../../../services/embeds/createReplyEmbed.js';
import { setBotReplies } from "../../../../managers/botRepliesManager.js";

export default async (interaction, type) => {
  const replyID = interaction.options.getString('id');
  let input = interaction.options.getString('new');
  if (input.includes(';')) {
    input = input.split(';').map(s => s.trim()).filter(Boolean);
  } else {
    input = [input.trim()];
  };
  const message = await setBotReplies({[type]: input, action: 'update', id: replyID });
  let embed;
  try {
    if (typeof message === 'object') {
      const triggerArrayBefore = JSON.parse(message.old.triggers)
      const triggerStringBefore = triggerArrayBefore.join('\n-  ');
      const triggerArrayAfter = JSON.parse(message.new.triggers)
      const triggerStringAfter = triggerArrayAfter.join('\n-  ');
      const responseArrayBefore = JSON.parse(message.old.responses)
      const responseStringBefore = responseArrayBefore.join('\n-  ');
      const responseArrayAfter = JSON.parse(message.new.responses)
      const responseStringAfter = responseArrayAfter.join('\n-  ');
      embed = new EmbedBuilder()
        .setColor(0xE67E22)
        .setTitle('Reply Updated')
        .setDescription(`**ID:** ${message.old.id}`)
        .setFields(
          {
            name: 'Triggers',
            value: ' '
          },
          {
            name: 'Before',
            value: `- ${triggerStringBefore}`,
            inline: true
          },
          {
            name: 'After',
            value: `- ${triggerStringAfter}`,
            inline: true
          },
          {
            name: 'Responses',
            value: ' '
          },
          {
            name: 'Before',
            value: `- ${responseStringBefore}`,
            inline: true 
          },
          {
            name: 'After',
            value: `- ${responseStringAfter}`,
            inline: true
          }
        )
        .setTimestamp()
    } else {
      embed = createErrorEmbed({ 
        int: interaction, 
        descr: message
      });
    }
    return embed;
  } catch (error) {
    console.log('Error generating UpdateReply embed:', error);
  }
}