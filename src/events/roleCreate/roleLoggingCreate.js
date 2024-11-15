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
          value: `${role.mentionable}`
        },
        {
          name: 'Display Separatly',
          value: `${role.hoist}`
        }
      )
      .setFooter({
        text: `Role ID: ${role.id}`
      })
      .setTimestamp()

    await setEventTimeOut('server', role.id, embed, logChannel);

    console.log(`A new role ${role.name} with ID: ${role.id} was created in Server ${role.guild.id}.`);

  } catch (error) {
    console.error('Failed to log Role Create!', error);
  }
}