const cron = require('node-cron');
const { query } = require('../../database/db');
const { deleteData } = require('../../database/controlData/deleteData');
const { updateData } = require('../../database/controlData/updateData');
const moment = require("moment");

const tables = ['GuildSettings', 'LevelSystem', 'LevelSettings', 'EventEmbeds', 'GeneratedEmbeds', 'ReactionRoles'];

console.log(
  '-----------------------------------\n' + 
  `${moment().local().format('YYYY-MM-DD HH:mm:ss')}\n` +
  'Initializing database cleanup job\n' + 
  '-----------------------------------'
);

cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const cleanupInfo = await cleanupExpiredData(now);
    console.log(`Cleanup Job completed. Tables cleaned: ${cleanupInfo.length}`);
    cleanupInfo.forEach(info => {
      console.log(`Table: ${info.table}, Rows deleted: ${info.rowsDeleted}`)
    });
  } catch (error) {
    console.error('Error running cleanup job:', error);
  }
});

async function cleanupExpiredData(now) {
  const cleanupInfo = [];

  for (const table of tables) {
    const [rowsToDelete] = await query(`SELECT COUNT(*) AS count FROM ${table} WHERE deletionDate IS NOT NULL AND deletionDate < ?`, [now]);
    const rowsDeleted = rowsToDelete[0]?.count || 0;

    if (rowsDeleted > 0) {
      await query(`DELETE FROM ${table} WHERE deletionDate IS NOT NULL AND deletionDate < ?`, [now]);
    }

    cleanupInfo.push({
      table: table,
      rowsDeleted: rowsDeleted
    });
  }
  return cleanupInfo;
}

async function setDeletionDate(id, data) {
  for (const table of tables) {
    try {
      await updateData(table, {guildId: id}, {deletionDate: data});
    } catch (error) {
      console.error(`Failed to set the deletionDate for guild ${id}.`, error);
    }
  }  
}

async function resetDeletionDate(id) {
  for (const table of tables) {
    try {
      await deleteData(table, {guildId: id}, {deletionDate: null});
    } catch (error) {
      console.error(`Failed to reset Deletion Date of the ${table} table for guild ${guild.id}.`, error);
    }
  }
}

module.exports = { setDeletionDate, resetDeletionDate };