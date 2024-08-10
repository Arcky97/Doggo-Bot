const { ApplicationCommandOptionType } = require("discord.js");
const { setTriggerResponses } = require("../../../database/triggerResponses/setTriggerResponses");

module.exports = {
  name: 'checkreply',
  description: 'Check for existing similar triggers.',
  devOnly: true,
  options: [
    {
      name: 'trigger',
      description: 'The trigger phrase to check.',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  callback: async (client, interaction) => {
    const trigger = interaction.options.getString('trigger');
    const message = await setTriggerResponses({trigger: trigger, action: 'check'});
    await interaction.reply(message);
  }
}