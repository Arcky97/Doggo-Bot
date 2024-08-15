const { setBotReplies } = require("../../database/botReplies/setBotReplies");

const removeReply = async (interaction) => {
  const replyID = interaction.options.getString('id');
  const message = await setBotReplies({id: replyID, action: 'remove'});
  await interaction.reply(message);
};

module.exports = { removeReply };