const { Client, Role, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');

module.exports = async (client, role) => {
  const guildId = role.guild.id;
  try {
    
    const logChannel = await getLogChannel(client, guildId, 'server');
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

    await setEventTimeOut('server', role.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Role Create!', error);
  }
}