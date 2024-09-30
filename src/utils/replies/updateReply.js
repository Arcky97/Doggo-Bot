const { EmbedBuilder } = require("discord.js");
const { setBotReplies } = require("../../../database/botReplies/setBotReplies");

const updateReply = async (interaction) => {
  const replyID = interaction.options.getString('id');
  let trigger = interaction.options.getString('new');
  if (trigger.includes(';')) {
    trigger = trigger.split(';').map(s => s.trim()).filter(Boolean);
  } else {
    trigger = [trigger.trim()];
  };
  const message = await setBotReplies({trigger: trigger, action: 'update', id: replyID });
  try {
    if (typeof message === 'object') {
      let triggerArrayBefore = JSON.parse(message.old.triggers);
      let triggerStringBefore = triggerArrayBefore.join('\n-  ');
      let triggerArrayAfter = JSON.parse(message.new.triggers);
      let triggerStringAfter = triggerArrayAfter.join('\n-  ');
      let responseArrayBefore = JSON.parse(message.old.responses);
      let responseStringBefore = responseArrayBefore.join('\n- ');
      let responseArrayAfter = JSON.parse(message.new.responses);
      let responseStringAfter = responseArrayAfter.join('\n- ');
      let resp = responseArrayBefore.length > 1 ? 'Responses' : 'Response'
      const embed = new EmbedBuilder()
        .setColor(0xE67E22)
        .setTitle('Reply Updated')
        .setDescription(`**ID:** ${message.old.id}`)
        .addFields(
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
      await interaction.reply({ embeds: [embed]});
    } else {
      await interaction.reply(message);
    }
  } catch (error) {
    console.log('Error generating embed:', error);
  }
}

module.exports = { updateReply };