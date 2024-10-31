const { EmbedBuilder } = require("discord.js");
const { setBotReplies } = require("../../../database/botReplies/setBotReplies");
const { createErrorEmbed } = require("../createReplyEmbed");

const removeReply = async (interaction) => {
  const replyID = interaction.options.getString('id');
  const message = await setBotReplies({id: replyID, action: 'remove'});
  let embed;
  try {
    if (typeof message === 'object') {
      let triggerArray = JSON.parse(message.triggers);
      let triggerString = triggerArray.join('\n-  ');
      let trig = triggerArray.length > 1 ? 'Triggers:' : 'Trigger:'
      let responseArray = JSON.parse(message.responses);
      let responseString = responseArray.join('\n-  ');
      let resp = responseArray.lenght > 1 ? 'Responses:' : 'Response:'
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
      embed = createErrorEmbed(interaction, message);
    }
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error generating removeReply embed:', error);
  }
}

module.exports = { removeReply };