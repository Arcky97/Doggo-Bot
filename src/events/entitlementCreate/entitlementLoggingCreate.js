// Premium Access 
const { Client, Entitlement, EmbedBuilder } = require('discord.js');
const getEntitlementTypeName = require('../../utils/logging/getEntitlementTypeName');
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const { setBotStats } = require('../../../database/BotStats/setBotStats');

module.exports = async (entitlement) => {
  const guildId = entitlement.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'entitlementCreate' });
    // return if entitlement is not for client.
    if (entitlement.applicationId !== client.id) return;
    // Only Main Server 
    const logChannel = client.channels.cache.get('1305294469918101547');
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`New ${getEntitlementTypeName(entitlement)} Created!`)
      .setFields(
        {
          name: `Purchased Item ID`,
          value: entitlement.skuId
        },
        {
          name: 'Server',
          value: entitlement.guildId || 'No Server specified'
        },
        {
          name: 'User ID',
          value: entitlement.userId 
        }
      )
      .setFooter({
        text: `Entitlement ID: ${entitlement.id}`
      })
      .setTimestamp()
    
    await setEventTimeOut('Entitlement', entitlement.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Entitlement Create!',error);
  }
}