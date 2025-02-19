//Premium Access
const { Client, Entitlement, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (oldEntitlement, newEntitlement) => {
  try {
    //await setBotStats(guildId, 'event', { event: 'entitlementUpdate' });
  } catch (error) {
    console.error(error);
  }
}