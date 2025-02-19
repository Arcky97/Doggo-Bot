const { Client, StageInstance, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const checkLogTypeConfig = require('../../managers/logging/checkLogTypeConfig');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (stageInstance) => {
  const guildId = stageInstance.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'stageInstanceCreate' });
    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'stages', option: 'creates' });
    if (!configLogging) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Stage Instance Created')
      .setFields(
        {
          name: 'Stage Channel',
          value: `${stageInstance.channel}`
        },
        {
          name: 'Topic',
          value: stageInstance.topic ? `${stageInstance.topic}` : 'None'
        },
        {
          name: 'Privacy Level',
          value: stageInstance.privacyLevel === 1 ? 'Public' : 'Server Only'
        }
      )
      .setFooter({
        text: `Stage Instance ID: ${stageInstance.id}`
      })
      .setTimestamp()

    await eventTimeoutHandler('server', stageInstance.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Stage Instance Create', error);
  }
}