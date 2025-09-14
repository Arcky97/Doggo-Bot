import { ApplicationCommandOptionType } from "discord.js";
import infoBot from "./subCommands/infoBot.js";
import { createErrorEmbed, createNotDMEmbed } from "../../../services/embeds/createReplyEmbed.js";
import { setBotStats } from "../../../managers/botStatsManager.js";
import { setUserCommandStats } from "../../../managers/userStatsManager.js";

export default {
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
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "stats",
          description: "Shows detailed Stats of Doggo Bot."
        }
      ]
    }
  ],
  callback: async (interaction) => {
    const guildId = interaction.guild.id;
    const memberId = interaction.member.id;
    const cmd = { category: 'misc', command: 'info' };

    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({ 
      embeds: [createNotDMEmbed(interaction)] 
    });

    let embed; 
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();
    
    try {
      switch(subCmdGroup) {
        case "bot":
          embed = await infoBot(interaction, subCmd, guildId);
          break;
      }
      await setBotStats(guildId, 'command', cmd);
      await setUserCommandStats(guildId, memberId, cmd);
    } catch (error) {
      console.error('Error with the Info command:', error);
      embed = createErrorEmbed({int: interaction, descr: `Something went wrong with the \`/info ${subCmdGroup} ${subCmd}\` command. Please try again later.`});
    }
    await interaction.editReply({ embeds: [embed] });
  } 
}