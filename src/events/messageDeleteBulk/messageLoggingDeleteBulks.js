const { Client, Message, EmbedBuilder } = require("discord.js");
const { selectData } = require("../../../database/controlData/selectData");

module.exports = async (client, bulk) => {
  try {
    const messageLogChannelId = await selectData('GuildSettings', { guildId: bulk.first().guild.id });

    if (!messageLogChannelId || !messageLogChannelId.messageLogging) return;

    const logChannel = client.channels.cache.get(messageLogChannelId.messageLogging);
    
    if (!logChannel) return;

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

      await logChannel.send({ embeds: [embed] })
  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}