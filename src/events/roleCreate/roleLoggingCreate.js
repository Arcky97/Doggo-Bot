const { Client, Role, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const checkLogTypeConfig = require('../../managers/logging/checkLogTypeConfig');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (role) => {
  const guildId = role.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'roleCreate' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'roles', option: 'creates' });
    if (!configLogging) return;
    
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`Role Created: ${role.name}`)
      .setFields(
        {
          name: 'Name',
          value: role.name 
        },
        {
          name: 'Color',
          value: `${role.hexColor}` 
        },
        {
          name: 'Mentionable',
          value: `${role.mentionable ? 'Yes' : 'No'}`
        },
        {
          name: 'Display Separatly',
          value: `${role.hoist ? 'Yes' : 'No'}`
        }
      )
      .setFooter({
        text: `Role ID: ${role.id}`
      })
      .setTimestamp()

    await eventTimeoutHandler('server', role.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Role Create!', error);
  }
}