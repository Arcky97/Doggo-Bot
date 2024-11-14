const { createSuccessEmbed } = require("../../utils/embeds/createReplyEmbed");

module.exports = {
  name: 'ping',
  description: 'Replies with the bot ping!',
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    embed = createSuccessEmbed({int: interaction, title: 'Pong!', descr: `Client ${ping /10}ms \nWebsocket: ${client.ws.ping /10}ms`, footer: false});
    interaction.editReply({embeds: [embed]});
  }
};