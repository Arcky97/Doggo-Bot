const { setBotReplies } = require("../../../database/botReplies/setBotReplies");

const updateReply = async (interaction) => {
  const replyID = interaction.options.getString('id');
  const trigger = interaction.options.getString('new');
  const message = await setBotReplies({trigger: trigger, action: 'update', id: replyID });
  await interaction.reply(message);
}

module.exports = { updateReply };