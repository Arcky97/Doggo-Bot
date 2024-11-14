const { EmbedBuilder } = require('@discordjs/builders');
const { setBotReplies } = require('../../../database/botReplies/setBotReplies');
const { createErrorEmbed } = require('../embeds/createReplyEmbed');

const addReply = async (interaction) => {
  let trigger = interaction.options.getString('trigger');
  let response = interaction.options.getString('response');
  if (trigger.includes(';')) {
    trigger = trigger.split(';').map(s => s.trim()).filter(Boolean);
  } else {
    trigger = [trigger.trim()];
  };
  if (response.includes(';')) {
    response = response.split(';').map(s => s.trim()).filter(Boolean);
  } else {
    response = [response.trim()];
  };
  const message = await setBotReplies({trigger: trigger, response: response, action: 'insert' });
  let embed;
  try {
    if (typeof message === 'object') {
      let triggerArray = JSON.parse(message.triggers);
      let triggerString = triggerArray.join('\n-  ');
      let trig = triggerArray.length > 1 ? 'Triggers:' : 'Trigger:'
      let responseArray = JSON.parse(message.responses);
      let responseString = responseArray.join('\n- ');
      let resp = responseArray.length > 1 ? 'Responses:' : 'Response:'
      embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('Reply Added')
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
    console.error('Error generating AddReply embed:', error)
  }
}

module.exports = { addReply }