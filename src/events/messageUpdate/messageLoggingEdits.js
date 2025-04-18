const { Client, Message, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const truncateText = require('../../utils/truncateText');
const ignoreLogging = require('../../managers/logging/ignoreLogging');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const checkLogTypeConfig = require('../../managers/logging/checkLogTypeConfig');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (oldMessage, newMessage) => {
  if (!oldMessage.inGuild() || 
      !oldMessage.author ||
      oldMessage.author.bot || 
      (
        oldMessage.content === newMessage.content && 
        newMessage.embeds.length > oldMessage.embeds.length
      )
    ) return;

  const guildId = oldMessage.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'messageUpdate' });

    const logChannel = await getLogChannel(guildId, 'message');
    if (!logChannel) return;

    const configLogging = await checkLogTypeConfig({ guildId: guildId, type: 'message', option: 'edits' })
    if (!configLogging) return;

    if (await ignoreLogging(guildId, logChannel.id)) return;
    
    const oldContent = truncateText(oldMessage.content) || '*No content*';
    const newContent = truncateText(newMessage.content) || '*No content*';

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setAuthor({
        name: oldMessage.author.globalName,
        iconURL: oldMessage.author.avatarURL()
      })
      .setTitle(`Message edited in #${oldMessage.channel.name}`)
      .setURL(`https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channelId}/${oldMessage.id}`)
      .setFields(
        {
          name: 'Before:',
          value: oldContent
        },
        {
          name: 'After:',
          value: newContent
        }
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${oldMessage.author.id}`
      });

    await eventTimeoutHandler('message', 'edit', embed, logChannel);
    
  } catch (error) {
    console.error('There was an error sending the embed:', error);
  }
}