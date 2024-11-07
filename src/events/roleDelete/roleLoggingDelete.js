const { Client, Role, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, role) => {
  try {
    
    const logChannel = await getLogChannel(client, role.guild.id, 'server');
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(`Role Deleted: ${role.name}`)
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
          name: 'Position',
          value: `#${role.position}`
        },
        {
          name: 'Mentionable',
          value: `${role.mentionable}`
        },
        {
          name: 'Display Separatly',
          value: role.hoist
        }
      )
      .setFooter({
        text: `Role ID: ${role.id}`
      })
      .setTimestamp()

    await setEventTimeOut('role', role.id, embed, logChannel);

    console.log(`The role ${role.name} with ID: ${role.id} was deleted in Server ${role.guild.id}.`);
 
  } catch (error) {
    console.error('Failed to log Role Delete!', error);
  }
}