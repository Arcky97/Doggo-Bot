const { EmbedBuilder } = require("discord.js");
const { setBotReplies } = require("../../../../managers/botRepliesManager");

module.exports = async (interaction) => {
  const trigger = interaction.options.getString('trigger');
  const message = await setBotReplies({trigger: trigger, action: 'check'});
  try {
    let matches;
    if (typeof message.matches === 'object') {
      matches = message.matches.map(match => `- ${match}`).join('\n');
    } else {
      matches = message.matches;
    }
    const embed = new EmbedBuilder()
      .setColor(message.color)
      .setTitle('Found Matches')
      .setFields(
        {
          name: 'Input',
          value: trigger
        },
        {
          name: 'Matches',
          value: matches
        }
      )
      .setTimestamp()
    return embed;
  } catch (error) {
    console.log('Error generating CheckReply embed:', error);
  }
};