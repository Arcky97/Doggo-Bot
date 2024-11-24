const { Client, Role, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const { getRoleOrChannelBlacklist, getRoleOrChannelMultipliers, setLevelSettings } = require('../../../database/levelSystem/setLevelSettings');
const { setChannelOrRoleArray } = require('../../utils/setArrayValues');

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

/*
    const blackListRoles = await getRoleOrChannelBlacklist({ id: role.guild.id, type: 'role' });
    const roleMults = await getRoleOrChannelMultipliers({ id: role.guild.id, type: 'role' });
    let [_, setData] = setChannelOrRoleArray({ type: 'role', data: blackListRoles, id: role.id, remove: true });
    await setLevelSettings({ id: role.guild.id, setting: { 'blackListRoles': setData } });
    [_, setData] = setChannelOrRoleArray({ type: 'role', data: roleMults, id: role.id, remove: true });
    await setLevelSettings({ id: role.guild.id, setting: { 'roleMultipliers': setData } })
*/

    await setEventTimeOut('role', role.id, embed, logChannel);

    console.log(`The role ${role.name} with ID: ${role.id} was deleted in Server ${role.guild.id}.`);
 
  } catch (error) {
    console.error('Failed to log Role Delete!', error);
  }
}