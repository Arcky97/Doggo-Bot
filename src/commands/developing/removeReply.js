const { ApplicationCommandOptionType } = require("discord.js");
const { setTriggerResponses } = require("../../../database/triggerResponses/setTriggerResponses");

module.exports = {
  name: 'removereply',
  description: 'Remove an exisiting reply.',
  devOnly: true,
  options: [
    {
      name: 'replyid',
      description: 'The ID of the reply to remove.',
      type: ApplicationCommandOptionType.String,
      required: true 
    }
  ],
  callback: async (client, interaction) => {
    const replyID = interaction.options.getString('replyid');
    const message = await setTriggerResponses({id: replyID, action: "remove"});
    await interaction.reply(message);
  }
}