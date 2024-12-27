const cron = require('node-cron');
const convertNumberInTime = require('../utils/convertNumberInTime');
const { createTimeoutRemoveLogEmbed, createUnmuteLogEmbed, createUnbanLogEmbed } = require('../utils/sendModerationLogEvent');
const { query } = require('../../database/db');
const activeTimeouts = new Map();

// Run Scheduled task every day at midnight.
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily timeout check...');

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).gettime();
  const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;

  const todayStartISO = new Date(todayStart).toISOString();
  const tomorrowStartISO = new Date(tomorrowStart).toISOString();

  try {
    const expiringTimeouts = await query(`
      SELECT userId, guildId, endTime
      FROM ModerationLogs
      WHERE endTime BETWEEN ? AND ?
    `, [todayStartISO, tomorrowStartISO]);
  } catch (error) {
    console.error('Error getting the time from ModerationLogs table:', error);
    return;
  }

  for (const timeout of expiringTimeouts) {
    const remainingMs = timeout.endTime - Date.now();

    if (remainingMs > 0) {
      setTimeout(async () => {
        console.log('Time out was added for this event and has now ended');
      }, remainingMs);
    } else {
      console.log('Time out has already ended before the check due to server downtime (not really)');
    }
  }
});

// Check if a task it's already scheduled in a setTimeout Function.
async function isModerationTask(nextId) {

}

// add a task in a setTimeout Function.
async function addModerationTask(nextId, guild, member, mod, duration, type, logging, logChannel) {
  if (activeTimeouts.has(nextId)) {
    console.error(`A timeout with ID ${nextId} already exists.`);
    return;
  }
  activeTimeouts.set(nextId, guild.id);
  setTimeout(async () => {
    removeModerationTask(nextId);
    const fields = [{
      name: `ID: ${nextId}`,
      value:  `**${type === 'ban' ? 'User' : 'Member'}:** ${member}\n`
              
    }];
    if (logging) {
      switch (type) {
        case 'timeout':
          fields.value += `**Timed out by:** ${mod}\n` +
                          `**Reason: Automatic Removal\n` +
                          `**Time Timed out:** ${convertNumberInTime(duration, 'Miliseconds')}`;
          await createTimeoutRemoveLogEmbed(guild, logChannel, fields);
          break;
        case 'mute':
          fields.value += `**Muted by:** ${mod}\n` +
                          `**Reason: Automatic Unmute\n` +
                          `**Time Muted:** ${convertNumberInTime(duration, 'Miliseconds')}`;
          await createUnmuteLogEmbed(guild, logChannel, fields)
          break;
        case 'ban':
          fields.value += `**Banned by:** ${mod}\n` +
                          `**Reason: Automatic Unban\n` +
                          `**Time Banned:** ${duration}`;
          await createUnbanLogEmbed(guild, logChannel, fields);
          break;
      }
    }
  }, duration);
}

//remove a task from a setTimeout Function.
async function removeModerationTask(nextId) {
  activeTimeouts.delete(nextId);
}

module.exports = { addModerationTask, removeModerationTask };