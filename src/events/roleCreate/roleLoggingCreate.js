const { Client, Role, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, role) => {
  try {
    
    const logChannel = await getLogChannel(client, role.guild.id, 'server');
    if (!logChannel) return;

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