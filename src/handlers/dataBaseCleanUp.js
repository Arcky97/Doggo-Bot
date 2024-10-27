const cron = require('node-cron');
const { query } = require('../../database/db');

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
  const tables = ['GuildSettings']
  await query(`DELETE FROM ${table} WHERE deletionDate IS NOT NULL AND deletionDate < ?`, [now])
}