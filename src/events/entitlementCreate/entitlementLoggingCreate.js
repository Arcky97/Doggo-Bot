// Premium Access 
const { Client, Entitlement, EmbedBuilder } = require('discord.js');
const getEntitlementTypeName = require('../../utils/logging/getEntitlementTypeName');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

module.exports = async (client, entitlement) => {
  try {
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

    console.log(`A new Entitlement with ID: ${entitlement.id} was created by User ID: ${entitlement.userId}.`)
  } catch (error) {
    console.error('Failed to log Entitlement Create!',error);
  }
}