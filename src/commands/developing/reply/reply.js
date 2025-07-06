import { ApplicationCommandOptionType } from "discord.js";
import addReply from "./subCommands/addReply.js";
import updateReply from "./subCommands/updateReply.js";
import removeReply from "./subCommands/removeReply.js";
import checkReply from "./subCommands/checkReply.js";
import listReply from "./subCommands/listReply.js";
import { createErrorEmbed, createNotDMEmbed } from "../../../services/embeds/createReplyEmbed.js";
import { setBotStats } from "../../../managers/botStatsManager.js";

export default {
  name: 'reply',
  description: 'manage the bot reply system.',
  devOnly: true,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'add',
      description: 'Add a new reply.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'trigger',
          description: 'The trigger phrase.',
          required: true
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'response',
          description: 'The response phrase, you can add more than 1 at once by separating them with ";".',
          required: true
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'update',
      description: 'Update an existing Trigger or Response',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'trigger',
          description: 'Update an existing Trigger by ID',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'id',
              description: 'The ID of the trigger to edit',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'new',
              description: 'The new Trigger phrase(s)',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'response',
          description: 'Update an existing Response by ID.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'id',
              description: 'The ID of the response to edit',
              required: true
            }, 
            {
              type: ApplicationCommandOptionType.String,
              name: 'new',
              description: 'The New Response phrase(s)',
              required: true
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'remove',
      description: 'Remove a reply by ID.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'id',
          description: 'The ID of the reply you want to remove.',
          required: true
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'check',
      description: 'Check for existing similar replies.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'trigger',
          description: 'The trigger phrase to check.',
          required: true
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'list',
      description: 'Show a list of all Replies with their id.'
    }
  ],
  callback: async (interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({
      embeds: [createNotDMEmbed(interaction)]
    });

    let embed;
    const subCmd = interaction.options.getSubcommand();
    const subCmdGroup = interaction.options.getSubcommandGroup();
    
    try {
      switch(subCmdGroup) {
        case 'update':
          embed = await updateReply(interaction, subCmd);
          break;
        default:
          switch(subCmd) {
            case 'add':
              embed = await addReply(interaction);
              break;
            case 'remove':
              embed = await removeReply(interaction);
              break;
            case 'check':
              embed = await checkReply(interaction);
              break;
            case 'list':
              await listReply(interaction);
              break;
          }
      }
      await setBotStats(interaction.guild?.id, 'command', { category: 'developing', command: 'reply' });
    } catch (error) {
      console.error('Error with the Reply Command:', error);
      embed = createErrorEmbed({
        int: interaction,
        descr: 'There was an error with the Reply Command...'
      });
    }
    if (embed) interaction.editReply({ embeds: [embed] });
  }
};