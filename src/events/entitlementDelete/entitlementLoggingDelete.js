// Premium Access
const { Client, Entitlement, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, entitlement) => {
  try {
    const logChannel = await getLogChannel(client, entitlement, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}