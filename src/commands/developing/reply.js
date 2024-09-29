const { ApplicationCommandOptionType } = require("discord.js");
const { addReply } = require("../../utils/replies/addReply");
const { updateReply } = require("../../utils/replies/updateReply");
const { removeReply } = require("../../utils/replies/removeReply");
const { checkReply } = require("../../utils/replies/checkReply");
const { listReply } = require("../../utils/replies/listReply");

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
              description: 'The new Trigger phrase',
              required: true
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'response',
          description: 'Update an existing Response by ID and current Response',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'id',
              description: 'The ID of the response to edit',
              required: true
            }, 
            {
              type: ApplicationCommandOptionType.String,
              name: 'current',
              description: 'The Current Response phrase.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'new',
              description: 'The New Response phrase',
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
  callback: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();
    const subCommandGroup = interaction.options.getSubcommandGroup();
    if (subCommand === 'add') {
      await addReply(interaction);
    } else if (subCommandGroup === 'update') {
      if (subCommand === 'trigger') {
        await updateReply(interaction);
      } else if (subCommand === 'response') {

      }
    } else if (subCommand === 'remove') {
      await removeReply(interaction);
    } else if (subCommand === 'check') {
      await checkReply(interaction)
    } else if (subCommand === 'list') {
      await listReply(interaction)
    }
  }
};