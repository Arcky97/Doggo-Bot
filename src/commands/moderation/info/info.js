const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: 'info',
  description: 'View Info about various stuff in the server.',
  deleted: true,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'bot',
      description: 'View Info about Doggo Bot.'
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'server',
      description: 'View Info about the Server.',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'channel',
      description: 'View Info about a Channel or Category.',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'name',
          description: 'The Channel or Category to check info from.',
          required: true 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'role',
      description: 'View Info about a Role.',
      options: [
        {
          type: ApplicationCommandOptionType.Role,
          name: 'name',
          description: 'The Role to check info from.',
          required: true 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'user',
      description: 'View Info about a User.',
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: 'name',
          description: 'The User to check info from.',
          required: true 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'emoji',
      description: 'View Info about an Emoji.',
      opions: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'name',
          description: 'The Emoji to check info from.',
          required: true
        }
      ]
    }
  ],
  callback: async (interaction) => {
    
  }
};