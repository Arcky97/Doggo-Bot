const { EmbedBuilder } = require('@discordjs/builders');
const { setBotReplies } = require('../../database/botReplies/setBotReplies');

const addReply = async (interaction) => {
  const trigger = interaction.options.getString('trigger');
  let response = interaction.options.getString('response');
  if (response.includes(';')) {
    response = response.split(';').map(s => s.trim()).filter(Boolean);
  } else {
    response = [response.trim()];
  }
  const message = await setBotReplies({trigger: trigger, response: response, action: 'insert' });
  try {
    if (typeof message == 'object') {
      let responseArray = JSON.parse(message.responses);
      let responseString = responseArray.join('\n- ')
      let response = responseArray.length > 1 ? 'Responses:' : 'Response:'
      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('New Reply Added')
        .setDescription(`**ID:** ${message.id}\n\n**Trigger:** ${message.triggers}\n\n**${response}**\n- ${responseString}`)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply(message);
    } 
  } catch (error) {
    console.error('Error generating embed:', error)
  }
  
}

module.exports = { addReply }