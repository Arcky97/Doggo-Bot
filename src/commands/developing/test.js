const { query } = require("../../../database/db");

module.exports = {
  name: 'test',
  description: 'Let\'s you test code that you are not sure it\'ll work.',
  devOnly: true,
  callback: async (interaction) => {
    const guildId = interaction.guild.id;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;

    const todayStartISO = new Date(todayStart).toISOString();
    const tomorrowStartISO = new Date(tomorrowStart).toISOString();

    const promise = await query(`
      SELECT *
      FROM ModerationLogs
      WHERE id = ?
    `,[106]);
    console.log(promise[0][0].endTime < tomorrowStart);
    interaction.reply('Command processed...');
    await setBotStats(guildId, 'command', { category: 'developing', command: 'test' });
  }
}