const { Client, Entitlement, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, oldEntitlement, newEntitlement) => {
  try {
    const logChannel = await getLogChannel(client, oldEntitlement.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}