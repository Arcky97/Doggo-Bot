const { Client, Sticker, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const checkLogTypeConfig = require('../../managers/logging/checkLogTypeConfig');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (sticker) => {
  const guildId = sticker.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'stickerCreate' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'stickers', option: 'creates'});
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Sticker ')
      .setFields(
        {
          name: 'Name',
          value: sticker.name
        },
        {
          name: 'Creator',
          value: `${sticker.user}`
        },
        {
          name: 'Description',
          value: sticker.description ? `${sticker.description}` : 'None'
        }
      )
      .setThumbnail(sticker.url())
      .setFooter({
        text: `Stciker ID: ${sticker.id}`
      })
      .setTimestamp()

    await eventTimeoutHandler('server', sticker.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Sticker Create!', error);
  }
}