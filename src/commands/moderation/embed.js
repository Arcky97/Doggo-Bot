const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { setEventEmbed } = require("../../../database/embeds/setEmbedData");

module.exports = {
  name: 'embed',
  description: 'Create embeds and send them to a channel of your choice.',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'create',
      description: 'Create a new embed.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'type',
          description: 'The type of the embed.',
          choices: [
            {
              name: 'regular',
              value: 'regular'
            },
            {
              name: 'welcome',
              value: 'welcome'
            },
            {
              name: 'leave',
              value: 'leave'
            },
            {
              name: 'ban',
              value: 'ban'
            }
          ],
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The channel to send the embed to.',
          required: true
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'title',
          description: 'The title of the embed.',
          required: true 
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'description',
          description: 'The description of the embed.',
          required: true
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'message',
          description: 'The message to include with the embed.'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'color',
          description: 'The color of the embed'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'author',
          description: 'The author of the embed'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'authorurl',
          description: 'The URL for the author'
        },
        { 
          type: ApplicationCommandOptionType.String,
          name: 'authoriconurl',
          description: 'The Icon URL for the author'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'titleurl',
          description: 'The URL for the title of the embed.'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'imageurl',
          description: 'The URL for the image of the embed.'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'thumbnailurl',
          description: 'The URL of the thumbnail of the embed'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'footer',
          description: 'The footer of the embed.'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'footericonurl',
          description: 'The URL of the icon of the footer.'
        },
        {
          type: ApplicationCommandOptionType.Boolean,
          name: 'timestamp',
          description: 'Wether to use a Time Stamp for the embed.'
        }
      ]
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const embedAction = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const channel = interaction.options.getChannel('channel').id;
    const type = interaction.options.getString('type');

    const embedOptions = {
      title: 'Embed Title',
      description: 'Description',
      message: null,
      color: null,
      author: null,
      authorUrl: null,
      authorIconUrl: null,
      titleUrl: null,
      imageUrl: null,
      thumbnailUrl: null,
      footer: null,
      footerIconUrl: null,
      timeStamp: true,
    };

    for (const option of interaction.options._hoistedOptions) {
      if (option.name === 'channel' || option.name === 'type') continue;
      let name = option.name;
      const value = option.value;

      if (name.includes('icon')) name = name.replace('icon', 'Icon'); 
      if (name.includes('url')) name = name.replace('url', 'Url'); 

      if(value !== undefined) {
        embedOptions[name] = value;
      }
    }
    try {
      if (embedAction === 'create') {
        if (type === 'regular') {
          let embed;

          // create and send the embed and save it to the database
        } else {
          setEventEmbed(guildId, channel, type, embedOptions);
          // save the embed to the database.
        }
        await interaction.editReply('Creating your Embed...');
      }
    } catch (error) {
      console.error(`There was an error while trying to ${embedAction} the embed:`, error);
      await interaction.editReply(`Something went wrong while trying to ${embedAction} the Embed.`);
    }
  }
}