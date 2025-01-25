const cron = require('node-cron');
const { createTimeoutRemoveLogEmbed, createUnmuteLogEmbed, createUnbanLogEmbed } = require('../utils/sendModerationLogEvent');
const { nextModerationLogId, addModerationLogs, addModerationLogTimeoutId, setModerationLogStatus } = require('../../database/moderationLogs/setModerationLogs');
const { getMuteRole } = require('../../database/guildSettings/setGuildSettings');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../../database/db');

const activeTimeouts = new Map();

console.log(
  'Initializing Moderation Tasks Check\n' +
  '-----------------------------------'
);

// Run Scheduled task every day at midnight.
cron.schedule('0 0 * * *', async () => {
  await checkModerationTasks('pending');
});

async function checkModerationTasks(status) {
  console.log(
    '-----------------------------------\n' +
    'Moderation Tasks Check Started'
  );

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;

  const todayStartISO = new Date(todayStart).toISOString();
  const tomorrowStartISO = new Date(tomorrowStart).toISOString();

  const moderationLogs = await query(`
    SELECT *
    FROM ModerationLogs
    WHERE status = ? AND endTime BETWEEN ? AND ?
    `, [status, todayStartISO, tomorrowStartISO]).catch(error => {
    console.error(`Error fetching Data from ModerationLogs`, error);
    return [];
  });

  const expiringTimeouts = moderationLogs.at(0) || [] //?.filter(timeout => timeout.endTime >= todayStart && timeout.endTime < tomorrowStart) || [];

  let counter = 0
  await Promise.all(expiringTimeouts.map(async timeout => {
    try {
      const nextId = await nextModerationLogId() + counter;
      const guild = client.guilds.cache.get(timeout.guildId) || await client.guilds.fetch(timeout.guildId).catch(() => null);
      if (!guild) {
        console.warn(`Guild not found for ID: ${timeout.guildId}`);
        return;
      }

      const member = guild.members.cache.get(timeout.userId) || await client.users.fetch(timeout.userId).catch(() => null);
      if (!member) {
        console.warn(`Member not found for ID: ${timeout.userId} in guild: ${guild.id}`);
        return;
      }

      const logChannel = guild.channels.cache.get(timeout.logChannel) || await guild.channels.fetch(timeout.logChannel).catch(() => null);
      if (!logChannel) {
        console.warn(`Channel not found for ID: ${timeout.logChannel} in guild: ${guild.id}`);
        return;
      }

      const remainingMs = timeout.endTime - Date.now();
      if (remainingMs < 0) {
        await removeModerationTask(timeout.id, timeout.guildId, timeout.timeoutUUID);
        return;
      } else {
        await setModerationLogStatus(timeout.id, guild.id, 'scheduled');
        counter += 1;
      }
      const timeoutUUID = await createTimeoutUUID(timeout.id, guild.id);
      await addModerationTask(nextId, timeoutUUID, guild, member, timeout.modId, remainingMs, timeout.action, timeout.formatDuration, timeout.logging, logChannel, timeout.date);
    } catch (error) {
      console.error(`Error processing timeout for ID: ${timeout.id}`, error);
    }
  }));
}

async function createTimeoutUUID(id, guildId) {
  const timeoutUUID = uuidv4();
  await addModerationLogTimeoutId(id, guildId, timeoutUUID);
  return timeoutUUID;
}

// add a task in a setTimeout Function.
async function addModerationTask(id, timeoutUUID, guild, member, modId, duration, action, formatDuration, logging, logChannel, beginTime) {
  await setModerationLogStatus(id, guild.id, 'scheduled');
  const timeoutId = setTimeout(async () => {
    await setModerationLogStatus(id, guild.id, 'completed');
    activeTimeouts.delete(timeoutUUID);
    const nextId = await nextModerationLogId();
    const fields = [
      {
        name: `ID: ${nextId}`,
        value:  `**${action === 'ban' ? 'User' : 'Member'}:** ${member}\n` 
      }
    ];
    if (logging) {
      switch (action) {
        case 'timeout':
          fields[0].value +=  `**Timed out by:** <@${modId}>\n` +
                              `**Timeout removed by:** ${client.user}\n` +
                              `**Reason:** Automatic Removal\n` +
                              `**Time Timed out:** ${formatDuration}`;
          await createTimeoutRemoveLogEmbed(guild, logChannel, fields);
          await addModerationLogs({ guildId: guild.id, userId: member.id, modId: modId, action: 'timeout remove', reason: 'Automatic Removal', status: 'completed', formatDuration: formatDuration, logging: logging, logChannel: logChannel?.id, date: beginTime });
          member.timeout(null, 'Automatic Removal');
          break;
        case 'mute':
          const muteRole = await getMuteRole(guild.id);
          fields[0].value +=  `**Muted by:** <@${modId}>\n` +
                              `**Unmuted by:** ${client.user}\n` +
                              `**Reason:** Automatic Unmute\n` +
                              `**Time Muted:** ${formatDuration}`;
          await member.roles.remove(muteRole);
          await createUnmuteLogEmbed(guild, logChannel, fields);
          await addModerationLogs({ guildId: guild.id, userId: member.id, modId: modId, action: 'unmute', reason: 'Automatic Removal', status: 'completed', formatDuration: formatDuration, logging: logging, logChannel: logChannel?.id, date: beginTime });
          break;
        case 'ban':
          fields[0].value +=  `**Banned by:** <@${modId}>\n` +
                              `**Unbanned by:** ${client.user}\n` +
                              `**Reason:** Automatic Unban\n` +
                              `**Time Banned:** ${formatDuration}`;
          guild.members.unban(member.id);
          await createUnbanLogEmbed(guild, logChannel, fields);
          await addModerationLogs({ guildId: guild.id, userId: member.id, modId: modId, action: 'unban', reason: 'Automatic Removal', status: 'completed', formatDuration: formatDuration, logging: logging, logChannel: logChannel?.id, date: beginTime });
          break;
      }
    }
  }, duration);
  activeTimeouts.set(timeoutUUID, timeoutId);
  console.log('Added to the setTimeout function');
}

async function removeModerationTask(id, guildId, timeoutUUID) {
  const timeoutId = activeTimeouts.get(timeoutUUID);
  clearTimeout(timeoutId);
  await setModerationLogStatus(id, guildId, 'completed');
  console.log('Removed from the setTimeout function');
}

module.exports = { addModerationTask, removeModerationTask, checkModerationTasks, createTimeoutUUID };