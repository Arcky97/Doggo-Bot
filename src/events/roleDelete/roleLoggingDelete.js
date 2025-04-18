const { Client, Role, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../managers/logging/getLogChannel');
const eventTimeoutHandler = require('../../handlers/eventTimeoutHandler');
const { getRoleOrChannelBlacklist, getRoleOrChannelMultipliers, setLevelSettings } = require('../../managers/levelSettingsManager');
const { setChannelOrRoleArray } = require('../../utils/setArrayValues');
const checkLogTypeConfig = require('../../managers/logging/checkLogTypeConfig');
const { setBotStats } = require('../../managers/botStatsManager');

module.exports = async (role) => {
  const guildId = role.guild.id;
  try {
    await setBotStats(guildId, 'event', { event: 'roleDelete' });

    const logChannel = await getLogChannel(guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', cat: 'roles', option: 'deletes'});
    if (!configLogging) return;
    
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
          value: `${role.mentionable ? 'Yes' : 'No'}`
        },
        {
          name: 'Display Separatly',
          value: `${role.hoist ? 'Yes': 'No'}`
        }
      )
      .setFooter({
        text: `Role ID: ${role.id}`
      })
      .setTimestamp()

    const blackListRoles = await getRoleOrChannelBlacklist({ id: guildId, type: 'role' });
    const roleMults = await getRoleOrChannelMultipliers({ id: guildId, type: 'role' });
    let [_, setData] = setChannelOrRoleArray({ type: 'role', data: blackListRoles, id: role.id, remove: true });
    await setLevelSettings({ id: guildId, setting: { 'blackListRoles': setData } });
    [_, setData] = setChannelOrRoleArray({ type: 'role', data: roleMults, id: role.id, remove: true });
    await setLevelSettings({ id: guildId, setting: { 'roleMultipliers': setData } })

    await eventTimeoutHandler('role', role.id, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Role Delete!', error);
  }
}