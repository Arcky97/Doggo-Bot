const { EmbedBuilder } = require("discord.js");
const { createErrorEmbed } = require('../../../../services/embeds/createReplyEmbed');
const { setBotReplies } = require("../../../../managers/botRepliesManager");

module.exports = async (interaction) => {
  const replyID = interaction.options.getString('id');
  const message = await setBotReplies({id: replyID, action: 'remove'});
  let embed;
  try {
    if (typeof message === 'object') {
      const triggerArray = JSON.parse(message.triggers);
      const triggerString = triggerArray.join('\n-  ');
      const trig = triggerArray.length > 1 ? 'Triggers:' : 'Trigger:';
      const responseArray = JSON.parse(message.responses);
      const responseString = responseArray.join('\n-  ');
      const resp = responseArray.lenght > 1 ? 'Responses:' : 'Response:';
      embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('Reply Removed')
        .setDescription(`**ID:** ${message.id}`)
        .setFields({
            name: trig,
            value: `- ${triggerString}`
          },
          {
            name: resp,
            value: `- ${responseString}`
          }
        )
        .setTimestamp();
    } else {
      embed = createErrorEmbed({ int: interaction, descr: message });
    }
    return embed;
  } catch (error) {
    console.error('Error generating removeReply embed:', error);
  }
}