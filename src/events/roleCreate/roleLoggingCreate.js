const { Client, Role, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, role) => {
  try {
    
    const channel = await getLogChannel(client, role.guild.id, 'server');
    if (!channel) return;

    console.log(`A new role ${role.name} with ID: ${role.id} was created in Server ${role.guild.id}.`);

  } catch (error) {
    console.error('Failed to log Role Create!', error);
  }
}