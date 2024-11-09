const { Client, Entitlement } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, entitlement) => {
  try {
    const logChannel = await getLogChannel(client, entitlement.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}