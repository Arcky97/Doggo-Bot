const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { setGeneratedEmbed, getGeneratedEmbed, deleteGeneratedEmbed, setEventEmbed, getEventEmbed, deleteEventEmbed } = require("../../../database/embeds/setEmbedData");
const getOrConvertColor = require("../../utils/getOrConvertColor");
const embedPlaceholders = require("../../utils/embedPlaceholders");

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
        },
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
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'description',
          description: 'The description of the embed.',
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
      name: 'delete',
      description: 'Detele a created embed by message ID.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'messageid',
          description: 'The message ID of the embed to delete.',
          required: true
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'type',
          description: 'The type of the embed',
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
          ]
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

    // Default options
    let embedOptions = {
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

    let embedData;
    let embed;

    if (embedAction !== 'create') {
      const messageId = interaction.options.getString('messageid');
      if (type === 'regular') {
        embedData = await getGeneratedEmbed(guildId, messageId);
      } else {
        embedData = await getEventEmbed(guildId, type);
      }

      if (!embedData) {
        await interaction.editReply(`No embed found with the specified ${embedAction === 'edit' ? 'message ID' : 'type'}.`);
        return;
      }

      // Merge the fetched embed data into embedOptions (filling default values)
      embedOptions = { ...embedOptions, ...embedData };
    }

    // Update embedOptions with user input from the command
    if (embedAction !== 'delete') {
      for (const option of interaction.options._hoistedOptions) {
        if (option.name === 'channel' || option.name === 'type') continue;
        let name = option.name;
        const value = option.value;

        if (name.includes('icon')) name = name.replace('icon', 'Icon');
        if (name.includes('url')) name = name.replace('url', 'Url');
        if (name.includes('stamp')) name = name.replace('stamp', 'Stamp');

        if (value !== undefined) {
          embedOptions[name] = value;
        }
      }
      // Build the embed object
      embed = new EmbedBuilder()
        .setTitle(embedPlaceholders(embedOptions.title, interaction.guild, interaction))
        .setDescription(embedPlaceholders(embedOptions.description, interaction.guild, interaction));

      if (embedOptions.color) embed.setColor(await getOrConvertColor(embedOptions.color));
      if (embedOptions.titleUrl) embed.setURL(embedOptions.titleUrl);
      if (embedOptions.author) {
        const author = interaction.options.getMember('author');
        let authorObj = {
          name: author.user.username,
          url: embedOptions.authorUrl,
          iconURL: author.user.avatarURL(),
        };
        if (!embedOptions.authorUrl) delete authorObj.url;
        if (!embedOptions.authorIconUrl) delete authorObj.iconURL;
        embed.setAuthor(authorObj);
      }

      if (embedOptions.imageUrl) embed.setImage(embedOptions.imageUrl);
      if (embedOptions.thumbnailUrl) embed.setThumbnail(embedOptions.thumbnailUrl);
      if (embedOptions.footer) {
        let footerObj = {
          text: embedOptions.footer,
          iconURL: embedOptions.footerIconUrl,
        };
        if (!embedOptions.footerIconUrl) delete footerObj.footerIconUrl;
        embed.setFooter(footerObj);
      }
      if (embedOptions.timeStamp) embed.setTimestamp();
    }
    let replyMessage;
    try {
      if (embedAction === 'create') {
        if (type === 'regular') {
          const message = await channel.send({ content: embedOptions.message, embeds: [embed] });
          await setGeneratedEmbed(guildId, channel.id, message.id, embedOptions);
          replyMessage = `Your embed has been generated and sent to <#${channel.id}>.`;
        } else {
          if (embedData) {
            replyMessage = `You have already set a ${type} message, use '/embed edit' to update the ${type} message.`;
          } else {
            replyMessage = `Your ${type}'s message has been saved successfully!`;
            await setEventEmbed(guildId, channel.id, type, embedOptions);
          }
        }
        await interaction.editReply(replyMessage);
      } else {
        const messageId = interaction.options.getString('messageid');
        const oldEmbed = await getGeneratedEmbed(guildId, messageId);

        if (!oldEmbed) {
          return interaction.editReply(`The embed with message ID ${messageId} was not found.`);
        }
        
        const channel = client.channels.cache.get(oldEmbed.channelId);
        let message;
        if (messageId && channel) {
          try {
            message = await channel.messages.fetch(messageId);
          } catch (error) {
            if (error.code === 10008) { // Discord API error code for "Unknown Message"
              await deleteGeneratedEmbed(guildId, messageId); // Optionally remove the embed from the database
              replyMessage = 'The specified message has been deleted from the server.';
            } else {
              console.error('Error fetching the message:', error);
              replyMessage = 'An error occurred while fetching the message.';
            }
          }
        }
        if (embedAction === 'edit') {
          if (type === 'regular') {
            await message.edit({ content: embedOptions.message, embeds: [embed] });
            await setGeneratedEmbed(guildId, channel.id, message.id, embedOptions);
            replyMessage = `Your embed in <#${channel.id}> has been updated successfully.`;
          } else {
            replyMessage = `Your ${type} message has been updated successfully. Changes will be applied the next time the message is triggered.`;
            await setEventEmbed(guildId, channel.id, type, embedOptions);
          }
          await interaction.editReply(replyMessage);
        } else if (embedAction === 'delete') {
          if (oldEmbed) {
            if (message) await message.delete();
            if (type === 'regular') {
              await deleteGeneratedEmbed(guildId, messageId);
            } else {
              await deleteEventEmbed(guildId, type);
            }
            interaction.editReply(`The embed with message ID: ${messageId} in <#${channel.id}> was deleted successfully.`);
          } else {
            interaction.editReply(`The embed with message ID: ${messageId} does not exist.`);
          }
        }
      }
    } catch (error) {
      console.error(`There was an error while trying to ${embedAction} the embed:`, error);
      await interaction.editReply(`Something went wrong while trying to ${embedAction} the embed.`);
    }
  }
};