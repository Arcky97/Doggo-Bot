const { ApplicationCommandOptionType } = require("discord.js");
const { createInfoEmbed, createSuccessEmbed } = require("../../utils/embeds/createReplyEmbed");

module.exports = {
  name: 'random',
  description: 'Get a range of random members from the reactions of a specified message.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'messageid',
      description: 'The Message ID.',
      required: true 
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'emoji',
      description: 'The Emoji you want to use.',
      required: true
    },
    {
      type: ApplicationCommandOptionType.Channel,
      name: 'channel',
      description: 'The Channel the Message is located in.',
    },
    {
      type: ApplicationCommandOptionType.Number,
      name: 'amount',
      description: 'The Number of random Members (default 1).',
      minValue: 1
    }
  ],
  callback: async (client, interaction) => {
    const messageId = interaction.options.getString('messageid');
    const emoji = interaction.options.getString('emoji');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const amount = interaction.options.getNumber('amount') || 1;

    try {
      await interaction.deferReply();
      const message = await channel.messages.fetch(messageId);
      
      const reaction = message.reactions.cache.find(r => r.emoji.name === emoji || r.emoji.toString() === emoji);
      
      if (reaction) {
        const users = await reaction.users.fetch();

        const userArray = users.map(user => user.id);

        const randomUsers = userArray.sort(() => Math.random() - 0.5).slice(0, amount);

        embed = createSuccessEmbed({ int: interaction, title: 'The 100 Members Giveaway Winners!', descr: `The ${amount} Winners for the 100 Members Giveaway I announced a month back are: \n - <@${randomUsers.join('>\n - <@')}>`});
      } else {
        embed = createInfoEmbed({ int: interaction, title: 'No Reactions Found!', descr: `No reactions found for the emoji "${emoji}".`});
      }
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error retrieving message hash', error);
    }
  }
}