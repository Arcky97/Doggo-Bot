const { setBotReplies } = require('../../database/botReplies/setBotReplies');

const addReply = async (interaction) => {
  const trigger = interaction.options.getString('trigger');
  let response = interaction.options.getString('response');
  if (response.includes(';')) {
    response = response.split(';').map(s => s.trim()).filter(Boolean);
  } else {
    response = [response.trim()];
  }
  const message = await setBotReplies({trigger: trigger, response: response, action: "insert" });
  await interaction.reply(message);
}

module.exports = { addReply }