const { ApplicationCommandOptionType } = require("discord.js");
const { setGeneratedEmbed, getGeneratedEmbed, deleteGeneratedEmbed, setEventEmbed, getEventEmbed, deleteEventEmbed } = require("../../managers/embedDataManager");
const { createSuccessEmbed, createErrorEmbed, createWarningEmbed } = require("../../services/embeds/createReplyEmbed");
const { createGeneratedEmbed } = require("../../services/embeds/createDynamicEmbed");
const createMissingPermissionsEmbed = require("../../utils/createMissingPermissionsEmbed");
const { setBotStats } = require("../../managers/botStatsManager");

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
          name: 'fields',
          description: 'Add 1 or more Fields. (format: \'name: field name value: some field content inline: true\'',
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
          name: 'fields',
          description: 'Add 1 or more Fields. (format: \'name: field name value: some field content inline: true\'',
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
          required: true,
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
  callback: async (interaction) => {
    const embedAction = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const channel = interaction.options.getChannel('channel');
    const type = interaction.options.getString('type');

    await interaction.deferReply();

    const permEmbed = await createMissingPermissionsEmbed(interaction, interaction.member, ['ManageGuild'], channel);
    if (permEmbed) return interaction.editReply({ embeds: [permEmbed] });

    // Default options
    let embedOptions = {
      title: 'Embed Title',
      description: 'Description',
      fields: null,
      message: null,
      color: null,
      author: { 
        name: null, 
        url: null, 
        iconUrl: null 
      },
      url: null,
      imageUrl: null,
      thumbnailUrl: null,
      footer: { 
        text: null, 
        iconUrl: null 
      },
      timeStamp: true,
    };

    let embedData;
    let embed;

    if (embedAction === 'edit' ) {
      const messageId = interaction.options.getString('messageid');
      if (type === 'regular') {
        embedData = await getGeneratedEmbed(guildId, messageId);
      } else {
        embedData = await getEventEmbed(guildId, type);
      }

      if (!embedData) {
        embed = createErrorEmbed({
          int: interaction, 
          descr: `No embed found with the specified ${embedAction === 'edit' ? 'message ID' : 'type'}.`});
        return interaction.editReply({embeds: [embed]}); 
        
      }

      // Merge the fetched embed data into embedOptions (filling default values)
      embedOptions = { ...embedOptions, ...embedData };
      if (typeof embedOptions.author === 'string') embedOptions.author = JSON.parse(embedOptions.author);
      if (typeof embedOptions.footer === 'string') embedOptions.footer = JSON.parse(embedOptions.footer); 
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

        if (value) {
          if (typeof value === 'boolean' && option.name === 'authoriconurl') {
            embedOptions[name] = '{user avatar}';
          } else if (option.name === "fields") {
            const fields = value;
            const fieldArray = fields.split(';');

            const parseField = (fieldEl) => {
              const nameMatch = fieldEl.match(/name:\s*([^:]+?)(?=\s+(value:|inline:|$))/);
              const valueMatch = fieldEl.match(/value:\s*([^:]+?)(?=\s+(name:|inline:|$))/);
              const inlineMatch = fieldEl.match(/inline:\s*(true|false)/);

              return {
                name: nameMatch ? nameMatch[1].trim() : "",
                value: valueMatch ? valueMatch[1].trim() : "",
                inline: inlineMatch ? inlineMatch[1] === "true" : false
              };
            };
            const parsedFields = fieldArray.map(parseField);
            embedOptions[name] = JSON.stringify(parsedFields);
          } else if (option.name === "author" || option.name === "authorurl" || option.name === "authoriconurl" ) {
            if (option.name === "author") embedOptions.author.name = option.value;
            if (option.name === "authorurl") embedOptions.author.url = option.value;
            if (option.name === "authoriconurl") embedOptions.author.iconUrl = option.value;
          } else if (option.name === "footer" || option.name === "footericonurl") {
            if (option.name === "footer") embedOptions.footer.text = option.value;
            if (option.name === "footericonurl") embedOptions.footer.iconUrl = option.value;
          } else {
            embedOptions[name] = value;
          }
        }
      }
      // Build the embed object
      try {
        embed = await createGeneratedEmbed(interaction, embedOptions); 
      } catch (error) {
        console.error(error);
      }
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
        embed = createSuccessEmbed({int: interaction, title: 'Hoorray!', descr: replyMessage});
      } else {
        const messageId = interaction.options.getString('messageid');
        let message;
        const oldEmbed = await getGeneratedEmbed(guildId, messageId);
        const channel = client.channels.cache.get(oldEmbed?.channelId);
        try {
          if (messageId && channel) {
            try {
              message = await channel.messages.fetch(messageId);
            } catch (error) {
              if (error.code === 10008) { // Discord API error code for "Unknown Message"
                await deleteGeneratedEmbed(guildId, messageId); // Optionally remove the embed from the database
                replyMessage = 'The specified message has already been deleted.';
              } else {
                console.error('Error fetching the message:', error);
                replyMessage = 'An error occurred while fetching the message.';
              }
              embed = createErrorEmbed({int: interaction, descr: replyMessage});
            }
          }
        } catch (error) {
          embed = createErrorEmbed({ int: interaction, descr: `The Embed Message with ID: ${messageId} was not found. \nPlease check if this Message hasn't been deleted already or is from this Server.`});
          return interaction.editReply({embeds: [embed]});
        }
        if (embedAction === 'edit') {
          if (type === 'regular') {
            console.log(embedOptions);
            await message.edit({ content: embedOptions.message, embeds: [embed] });
            await setGeneratedEmbed(guildId, channel.id, message.id, embedOptions);
            replyMessage = `Your embed in <#${channel.id}> has been updated successfully.`;
          } else {
            replyMessage = `Your ${type} message has been updated successfully. Changes will be applied the next time the message is triggered.`;
            await setEventEmbed(guildId, channel.id, type, embedOptions);
          }
          embed = createSuccessEmbed({int: interaction, title: 'Embed Updated!', descr: replyMessage});
        } else if (embedAction === 'delete') {
          if (oldEmbed) {
            if (message) await message.delete();
            if (type === 'regular') {
              await deleteGeneratedEmbed(guildId, messageId);
            } else {
              await deleteEventEmbed(guildId, type);
            }
            embed = createSuccessEmbed({int: interaction, title: 'Embed Deleted!', descr: `The embed with message ID: ${messageId} in <#${channel.id}> was deleted succesfully.`});
          } else {
            embed = createWarningEmbed({int: interaction, descr: `The embed with message ID: ${messageId} does not exist. \nPlease check the message ID again.`});
            
          }
        }
      }
      await setBotStats(guildId, 'command', { category: 'moderation', command: 'embed' });
    } catch (error) {
      console.error(`There was an error while trying to ${embedAction} the embed:`, error);
      embed = createErrorEmbed({int: interaction, descr: `Something went wrong while trying to ${embedAction} the embed. \nPlease try again later.`});
    }
    interaction.editReply({embeds: [embed]});
  }
};