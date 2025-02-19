const { Client, Message, EmbedBuilder } = require("discord.js");
const getLogChannel = require("../../managers/logging/getLogChannel");
const ignoreLogging = require("../../managers/logging/ignoreLogging");
const { setBotStats } = require("../../managers/botStatsManager");

module.exports = async (bulk) => {
  const guildId = bulk.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'messageDeleteBulk' });

    const logChannel = await getLogChannel(bulk.first().guild.id, 'message');
    if (!logChannel) return;

    if (await ignoreLogging(bulk.guild.id, logChannel.id)) return;

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