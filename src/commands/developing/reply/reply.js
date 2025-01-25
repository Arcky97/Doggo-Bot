const { ApplicationCommandOptionType } = require("discord.js");
const addReply = require("./subCommands/addReply");
const updateReply = require("./subCommands/updateReply");
const removeReply = require("./subCommands/removeReply");
const checkReply = require("./subCommands/checkReply");
const listReply = require("./subCommands/listReply");

module.exports = {
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
    const subCmd = interaction.options.getSubcommand();
    const subCmdGroup = interaction.options.getSubcommandGroup();

    await interaction.deferReply();
    let embed;

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
    if (embed) interaction.editReply({ embeds: [embed] });
  }
};