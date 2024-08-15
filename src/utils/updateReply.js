const { setBotReplies } = require("../../database/botReplies/setBotReplies");

const updateReply = async (interaction) => {
  const replyID = interaction.options.getString('replyid');
  const trigger = interaction.options.getString('newtrigger');
  const message = await setBotReplies({trigger: trigger, action: "update", id: replyID });
  await interaction.reply(message);
}

module.exports = { updateReply };