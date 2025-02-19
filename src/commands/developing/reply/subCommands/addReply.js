const { EmbedBuilder } = require('@discordjs/builders');
const { setBotReplies } = require('../../../../managers/botRepliesManager');
const { createErrorEmbed } = require('../../../../services/embeds/createReplyEmbed');

module.exports = async (interaction) => {
  let trigger = interaction.options.getString('trigger');
  let response = interaction.options.getString('response');
  if (trigger.includes(';')) {
    trigger = trigger.split(';').map(s => s.trim()).filter(Boolean);
  } else {
    trigger = [trigger.trim()];
  }
  if (response.includes(';')) {
    response = response.split(';').map(s => s.trim()).filter(Boolean);
  } else {
    response = [response.trim()];
  }
  const message = await setBotReplies({trigger: trigger, response: response, action: 'insert' });
  let embed;
  try {
    if (typeof message === 'object') {
      const triggerArray = JSON.parse(message.triggers);
      const triggerString = triggerArray.join('\n-  ');
      const trig = triggerArray.length > 1 ? 'Triggers:' : 'Trigger:';
      const responseArray = JSON.parse(message.responses);
      const responseString = responseArray.join('\n- ');
      const resp = responseArray.length > 1 ? 'Responses:' : 'Response:';
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
      embed = createErrorEmbed({ int: interaction, descr: message });
    } 
    return embed;
  } catch (error) {
    console.error('Error generating AddReply embed:', error)
  }
}
