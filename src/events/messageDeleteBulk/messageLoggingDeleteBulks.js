const { Client, Message, EmbedBuilder } = require("discord.js");
const getLogChannel = require("../../utils/getLogChannel");

module.exports = async (client, bulk) => {
  try {
    const channel = await getLogChannel(client, bulk.first().guild.id, 'message');
    if (!channel) return;

    let bulkContent = [];

    bulk.forEach(message => {
      bulkContent.push(`**${message.author.globalName}:** ${message.content}`);
    });

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(`${bulkContent.length} ${bulkContent.length > 1 ? 'Messages' : 'Message'} purged in #${bulk.first().channel.name}`)
      .setDescription(`${bulkContent.join('\n')}`)
      .setTimestamp()
      .setFooter({
        text: `${bulkContent.length} latest shown`
      });

      await channel.send({ embeds: [embed] })
  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}