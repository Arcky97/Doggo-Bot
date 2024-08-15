const { ApplicationCommandOptionType } = require("discord.js");
const addReply = require("./addReply");

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
          description: 'The trigger phrase',
          required: true
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'response',
          description: 'The response phrase, you can add more than 1 at once by separting them with ";"',
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
              name: 'ID',
              description: 'The ID of the trigger to edit',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'newtrigger',
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
              name: 'ID',
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
    }
  ],
  callback: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();
    switch(subCommand) {
      case 'add':
        await addReply(interaction);
        break;
    }
  }
};