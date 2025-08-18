import cron from 'node-cron';
import { deleteData } from '../services/database/deleteData.js';
import { updateData } from '../services/database/updateData.js';
import moment from "moment";
import { query } from '../managers/databaseManager.js';

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
    console.log(
      '-----------------------------------\n' +
      `${moment().local().format('YYYY-MM-DD HH:mm:ss')}\n` +
      '-----------------------------------\n' +
      'Cleanup Job Started. Tables Checked:'
    )
    const cleanupInfo = await cleanupExpiredData(now);
    console.log(
      '-----------------------------------\n' +
      `Cleanup Job completed. Tables Cleaned: ${cleanupInfo.length}`
    );
    cleanupInfo.forEach(info => {
      console.log(`Table: ${info.table}, Rows deleted: ${info.rowsDeleted}`);
    });
  } catch (error) {
    console.error('Error running cleanup job:', error);
  }
});

async function cleanupExpiredData(now) {
  const cleanupInfo = [];

  const nowFormatted = now instanceof Date 
    ? now.toISOString().slice(0, 19).replace('T', ' ')
    : now;

  for (const table of tables) {
    const [rowsToDelete] = await query(`SELECT COUNT(*) AS count FROM ${table} WHERE deletionDate IS NOT NULL AND deletionDate < ?`, [nowFormatted]);
    const [rowsToCount] = await query(`SELECT COUNT(*) AS count FROM ${table}`);
    const rowsDeleted = rowsToDelete[0]?.count || 0;
    const rowsCounted = rowsToCount[0]?.count || 0;
    console.log(`Table: ${table}, Rows checked: ${rowsCounted}`);
    if (rowsDeleted > 0) {
      await query(`DELETE FROM ${table} WHERE deletionDate IS NOT NULL AND deletionDate < ?`, [nowFormatted]);
    }

    cleanupInfo.push({
      table: table,
      rowsDeleted: rowsDeleted
    });
  }
  return cleanupInfo;
}

export async function setDeletionDate(id, date) {
  for (const table of tables) {
    try {
      await updateData(table, {guildId: id}, {deletionDate: date});
    } catch (error) {
      console.error(`Failed to set the deletionDate for guild ${id}.`, error);
    }
  }  
}

export async function resetDeletionDate(id) {
  let hasMarkedData = false;

  for (const table of tables) {
    try {
      const [rows] = await query(
        `SELECT COUNT(*) AS count FROM ${table} WHERE guildId = ? AND deletionDate IS NOT NULL`,
        [id]
      );

      if (rows[0].count > 0) {
        hasMarkedData = true;

        await deleteData(table, { guildId: id }, { deletionDate: null });
      }
    } catch (error) {
      console.error(`Failed to process the ${table} table for guild ${id}.`, error);
    }
  }
  return hasMarkedData;
}