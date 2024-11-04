const { Client, Role, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, oldRole, newRole) => {
  try {
    
    const channel = await getLogChannel(client, oldRole.guild.id, 'server');
    if (!channel) return;

    console.log(`The role ${newRole.name} with ID: ${oldRole.id} was updated in Server ${oldRole.guild.id}.`)

  } catch (error) {
    console.error('Failed to log Role Update!', error);
  }
}