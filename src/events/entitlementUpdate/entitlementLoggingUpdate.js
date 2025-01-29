//Premium Access
const { Client, Entitlement, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const { setBotStats } = require('../../../database/BotStats/setBotStats');

module.exports = async (oldEntitlement, newEntitlement) => {
  try {
    //await setBotStats(guildId, 'event', { event: 'entitlementUpdate' });
  } catch (error) {
    console.error(error);
  }
}