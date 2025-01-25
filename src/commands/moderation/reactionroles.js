const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { insertReactionRoles, getReactionRoles, updateReactionRoles, removeReactionRoles, setReactionOrRoleLimit } = require("../../../database/reactionRoles/setReactionRoles");
const exportToJson = require("../../handlers/exportToJson");
const setMessageReactions = require("../../utils/setMessageReactions");
const createMissingPermissionsEmbed = require("../../utils/createMissingPermissionsEmbed");

module.exports = {
  name: 'reaction',
  description: 'Manage your Reaction Roles.',
  options: [
    {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: 'roles',
      description: 'Manage your Reaction Roles in the Server.',
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'create',
          description: 'Create a new Reaction Role Message.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'messageid',
              description: 'The ID of the message (or embed) to add Reaction Roles to.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'emojiroles',
              description: 'Add emojis and roles, separate by ";" to add multiple pairs (format: :emoji:, @role).',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'Channel where the message is located.',
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'edit',
          description: 'Edit the Reaction Roles of a message by changing the existing ones or adding more.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'messageid',
              description: 'The message ID of the message (or embed) to edit the Reaction Roles of.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.String,
              name: 'emojiroles',
              description: 'Add more emojis and roles or overwrite the existing ones. (see optional "overwrite" option.)',
              required: true
            }, 
            {
              type: ApplicationCommandOptionType.Boolean,
              name: 'overwrite',
              description: 'Wether to overwrite the existing Emoji Roles that had been added before.',
            },
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'Channel where the message is located.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'delete',
          description: 'Remove all Reaction Roles of a message.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'messageid',
              description: 'The message ID of the message (or embed) to remove the Reaction Roles.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'Channel where the message is located.'
            }
          ]
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'limit',
          description: 'Set the limit of members that can get a reaction role.',
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'messageid',
              description: 'The ID of the message.',
              required: true,
            },
            {
              type: ApplicationCommandOptionType.Integer,
              name: 'limit',
              description: 'Set the limit.',
              required: true
            },
            {
              type: ApplicationCommandOptionType.Channel,
              name: 'channel',
              description: 'Channel where the message is located.'
            }
          ]
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'limit',
      description: 'Set the limit number of roles you can get from one message at once.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'messageid',
          description: 'The ID of the message.',
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: 'limit',
          description: 'The role limit.',
          minValue: 1,
          maxValue: 250,
          required: true
        },
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'Channel where the message is located.'
        }
      ]
    }
  ],
  callback: async (interaction) => {
    const subCmdGroup = interaction.options.getSubcommandGroup();
    const subCmd = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const messageId = interaction.options.getString('messageid');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const overwrite = interaction.options.getBoolean('overwrite') || false; 
    const limit = interaction.options.getInteger('limit');
    const reactionRolesData = await getReactionRoles(guildId, channel.id, messageId);
    let emojiRolePairs = [];

    await interaction.deferReply();

    const permEmbed = await createMissingPermissionsEmbed(interaction, interaction.member, ['ManageGuild', 'ManageRoles', 'AddReactions']);
    if (permEmbed) return interaction.editReply({ embeds: [permEmbed] });
    
    if (subCmd === 'create' || subCmd === 'edit') {
      const emojiRoles = interaction.options.getString('emojiroles');
      const splitEmojiRoles = emojiRoles.split(';').map(s => s.trim());   
  
      for (const pair of splitEmojiRoles) {
        const [emoji, roleId] = pair.split(',');
    
        if (!emoji || !roleId) {
          return await interaction.editReply({ content: 'Invalid format for emoji-roles. Use format: :emoji:, @role', ephemeral: true });
        }
    
        emojiRolePairs.push({ emoji: emoji.trim(), roleId: roleId.trim() });
      }
    }

    let message;
    try {
      message = await channel.messages.fetch(messageId);
    } catch (error) {
      return await interaction.editReply({ content: `Message with ID ${messageId} not found in ${channel}. You can specify the channel or check the Message ID again.`, ephemeral: true });
    }
  
    if (reactionRolesData && !overwrite) {
      emojiRolePairs = emojiRolePairs.concat(JSON.parse(reactionRolesData.emojiRolePairs));
    }

    if (subCmd === 'create') {
      if (!reactionRolesData) {
        await setMessageReactions(interaction, message, emojiRolePairs, overwrite)
        await insertReactionRoles(guildId, channel.id, messageId, emojiRolePairs);
        await interaction.editReply('Reaction roles have been added to the message!');
      } else {
        await interaction.editReply('The message with ID ' + messageId + ' already has Reaction Roles added, use `/reaction roles edit` instead to add more or edit the existing ones.');
      }
    } else if (subCmd === 'edit') {
      if (overwrite) {
        await interaction.editReply('Reaction roles have been overwritten.');
      } else {
        await interaction.editReply('Reaction roles have been updated.');
      }
      await setMessageReactions(interaction, message, emojiRolePairs, overwrite);
      await updateReactionRoles(guildId, channel.id, messageId, emojiRolePairs);
    } else if (subCmd === 'delete') {
      await interaction.editReply('Reaction roles have been removed from the message.');
      await message.reactions.removeAll()
      await removeReactionRoles(guildId, channel.id, messageId);
    } else if (subCmd === 'limit') {
      if (subCmdGroup === 'roles') {
        await interaction.editReply(`Reaction role limit has been set to ${limit} for message with ID ${messageId}.`);
        await setReactionOrRoleLimit(guildId, channel.id, messageId, { maxRoles: limit } );
      } else {
        await interaction.editReply(`Reaction limit has been set to ${limit} for message with ID ${messageId}.`);
        await setReactionOrRoleLimit(guildId, channel.id, messageId, { maxReactions: limit } );
      }
    }
    await exportToJson('ReactionRoles', guildId);
  }
}