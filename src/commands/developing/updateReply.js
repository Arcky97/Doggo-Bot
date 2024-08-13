const { ApplicationCommandOptionType } = require("discord.js");
const { setBotReplies } = require("../../../database/botReplies/setBotReplies");

module.exports = {
  name: 'updatereply',
  description: 'Update an existing Trigger.',
  devOnly: true,
  options: [
    {
      name: 'replyid',
      description: 'The ID of the reply to edit.',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'newtrigger',
      description: 'The new Trigger phrase',
      type: ApplicationCommandOptionType.String,
      required: true 
    }
  ],
  callback: async (client, interaction) => {
    const replyID = interaction.options.getString('replyid');
    const trigger = interaction.options.getString('newtrigger');
    const message = await setBotReplies({trigger: trigger, action: "update", id: replyID });
    await interaction.reply(message);
  }
}