const { ApplicationCommandOptionType } = require("discord.js");
const { insertReactionRoles, getReactionRoles, updateReactionRoles } = require("../../../database/controlData/reactionRoles/setReactionRoles");
const { exportToJson } = require("../../../database/controlData/visualDatabase/exportToJson");
const addMessageReactions = require("../../utils/addMessageReactions");

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
              description: 'The message ID of the message (or embed) to add Reaction Roles to.',
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
            },
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
        }
      ]
    }
  ],
  callback: async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const messageId = interaction.options.getString('messageid');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const overwrite = interaction.options.getBoolean('overwrite') || false; 
    const reactionRolesData = await getReactionRoles(guildId, channel.id, messageId);
  
    const emojiRoles = interaction.options.getString('emojiroles');
    const splitEmojiRoles = emojiRoles.split(';').map(s => s.trim());
    let emojiRolePairs = [];

    await interaction.deferReply();

    for (const pair of splitEmojiRoles) {
      const [emoji, roleId] = pair.split(',');
  
      if (!emoji || !roleId) {
        return await interaction.editReply({ content: 'Invalid format for emoji-roles. Use format: :emoji:, @role', ephemeral: true });
      }
  
      emojiRolePairs.push({ emoji, roleId });
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
  
    if (subCommand === 'create') {
      if (!reactionRolesData) {
        await addMessageReactions(interaction, message, emojiRolePairs, overwrite)
        await insertReactionRoles(guildId, channel.id, messageId, splitEmojiRoles);
        await interaction.editReply('Reaction roles have been added to the message!');
      } else {
        await interaction.editReply('The message with ID ' + messageId + ' already has Reaction Roles added, use `/reaction roles edit` instead to add more or edit the existing ones.');
      }
    } else if (subCommand === 'edit') {
      if (overwrite) {
        await interaction.editReply('Reaction roles have been overwritten.');
      } else {
        await interaction.editReply('Reaction roles have been updated.');
      }
      await addMessageReactions(interaction, message, emojiRolePairs, overwrite)
      await updateReactionRoles(guildId, channel.id, messageId, emojiRolePairs);
    }
  
    exportToJson('ReactionRoles');
  }  
}
