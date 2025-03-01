const { ApplicationCommandOptionType } = require("discord.js");
const createMissingPermissionsEmbed = require("../../../utils/createMissingPermissionsEmbed");
const infoBot = require("./subCommands/infoBot");

module.exports = {
  name: "info",
  description: "Check various information about Users, Channels, Roles, the Server, Doggo Bot.",
  options: [
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: "bot",
      description: "Check various things about Doggo Bot.",
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "uptime",
          description: "Shows how long Doggo Bot has been online."
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "show",
          description: "Shows information about Doggo Bot."
        }
      ]
    }
  ],
  callback: async (interaction) => {
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();

    await interaction.deferReply();

    let embed;
    try {
      switch(subCmdGroup) {
        case "bot":
          embed = await infoBot(interaction, subCmd);
          break;
      }
    } catch (error) {
      console.error('Error with the Info command:', error);
      return;
    }
    await interaction.editReply({ embeds: [embed] });
  } 
}