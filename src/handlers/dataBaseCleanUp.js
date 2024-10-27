const cron = require('node-cron');
const { query } = require('../../database/db');

console.log('Initializing database cleanup job');

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
  const tables = ['GuildSettings', 'LevelSystem', 'LevelSettings', 'EventEmbeds', 'GeneratedEmbeds', 'ReactionRoles'];
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