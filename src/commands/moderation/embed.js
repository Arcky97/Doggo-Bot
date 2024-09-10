const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { setEventEmbed, setGeneratedEmbed, getGeneratedEmbed } = require("../../../database/embeds/setEmbedData");

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
          type: ApplicationCommandOptionType.Mentionable,
          name: 'author',
          description: 'The author of the embed'
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'authorurl',
          description: 'The URL for the author'
        },
        { 
          type: ApplicationCommandOptionType.Boolean,
          name: 'authoriconurl',
          description: "Wether to use the author's icon in the embed."
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
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'edit',
      description: 'Edit a created embed by message ID.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'messageid',
          description: 'The message ID of the embed to edit.',
          required: true
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'delete',
      description: 'Detele a created embed by message ID.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'messageid',
          description: 'The message ID of the embed to delete.',
          required: true
        }
      ]
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const embedAction = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const channel = interaction.options.getChannel('channel');
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
    let replyMessage;
    try {
      if (embedAction === 'create') {
        if (type === 'regular') {
          let embed;
          embed = new EmbedBuilder()
            .setTitle(embedOptions.title)
            .setDescription(embedOptions.description)

          if (embedOptions.color) embed.setColor(embedOptions.color);
          if (embedOptions.titleUrl) embed.setURL(embedOptions.titleUrl);
          if (embedOptions.author) {
            const author = interaction.options.getMember('author')
            let authorObj = {
              name: author.user.username,
              url: embedOptions.authorUrl,
              iconURL: author.user.avatarURL()
            };
            if (!embedOptions.authorUrl) delete authorObj.url;
            if (!embedOptions.authorIconUrl) delete authorObj.iconURL;
            embed.setAuthor(authorObj);
          }

          if (embedOptions.imageUrl) embed.setImage(embedOptions.imageUrl);
          if (embedOptions.thumbnailUrl) embed.setThumbnail(embedOptions.thumbnailUrl) 
          if (embedOptions.footer) {
            let footerObj = {
              text: embedOptions.footer,
              iconURL: embedOptions.footerIconUrl
            };
            if (!embedOptions.footerIconUrl) delete footerObj.footerIconUrl;
            embed.setFooter(footerObj)
          }
          if (embedOptions.timeStamp) embed.setTimestamp();
          
          const message = await channel.send({ embeds: [embed] });
          setGeneratedEmbed(guildId, channel.id, message.id, embedOptions);
          replyMessage = `Your embed has been generated and sent to <#${channel.id}>.`
          // create and send the embed and save it to the database
        } else {
          replyMessage = `Your ${type}'s Message has been saved successfully!`
          setEventEmbed(guildId, channel.id, type, embedOptions);
          // save the embed to the database.
        }
        await interaction.editReply(replyMessage);
      } else {
        const oldEmbed = getGeneratedEmbed(guildId, messageId);
        const channel = client.channels.cache.get(oldEmbed.channelId);
        const messageId = interaction.options.getString('messageid');
        const message = await channel.messages.fetch(messageId);
        if (embedAction === 'edit') {

        } else if (embedAction === 'delete') {
          await message.delete();
          interaction.editReply(`The embed with message ID: ${messageId} in <#${channel} was deleted successfully.`);
        }
      }
    } catch (error) {
      console.error(`There was an error while trying to ${embedAction} the embed:`, error);
      await interaction.editReply(`Something went wrong while trying to ${embedAction} the Embed.`);
    }
  }
}