const { ApplicationCommandOptionType } = require("discord.js");
const { createNotDMEmbed, createUnfinishedEmbed } = require("../../../services/embeds/createReplyEmbed");

module.exports = {
  name: 'doggoboard',
  description: 'DoggoBoard Command',
  deleted: true,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'channel',
      description: 'The Channel to sent Doggo Board Pins to.',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'channel',
          description: 'The Pins Channel',
          required: true 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'emoji',
      description: 'Add 1 or more Emojies to use by the Doggo Board.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'emoji',
          description: 'The Emoji you want to add (separate with ; when adding more than 1)',
          required: true
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'reactions',
      description: 'Set the required amount of Reactions before the message gets pinned.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'amount',
          description: 'The Amount of reactions.',
          required: true 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'message-age',
      description: 'Set the maximum Age of messages being monitored if not being pinned yet.',
      options: [
        {
          type: ApplicationCommandOptionType.Number,
          name: 'age',
          description: 'The maximum Age of messages (in hours).',
          required: true,
          minValue: 1,
          maxValue: 24
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'pin-age',
      description: 'Set the Amount of days a pinned messages gets updated.',
      options: [
        {
          type: ApplicationCommandOptionType.Number,
          name: 'age',
          description: 'The Amount of Days a pinned message being updated (in days)',
          required: true, 
          minValue: 1,
          maxValue: 7 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'update-time',
      description: 'Set the Time interval for pinned messages getting updated.',
      options: [
        {
          type: ApplicationCommandOptionType.Number,
          name: 'time',
          description: 'The Time interval for pinned messages updating (in minutes).',
          required: true, 
          minValue: 1,
          maxValue: 60 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'settings',
      description: 'Extra Settings before messages are being pinned',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'setting',
          description: 'Set when multiple Reactions, require "both", "one of all" or "the sum of all" before pinned.',
          required: true,
          choices: [
            {
              name: 'both',
              value: 'and'
            },
            {
              name: 'one of all',
              value: 'or'
            },
            {
              name: 'sum of all',
              value: 'sum'
            }
          ]
        }
      ]
    }
  ],
  callback: async (interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({
      embeds: [createNotDMEmbed(interaction)]
    });

    let embed;

    embed = createUnfinishedEmbed(interaction);

    interaction.editReply({ embeds: [embed] });
  }
};