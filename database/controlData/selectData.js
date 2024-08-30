const { query } = require("../db");

async function selectData(table, key) {
  const whereClause = Object.keys(key).map(key => `${key} = ?`).join(' AND ');
  const whereValues = Object.values(key);
  const selectQuery = `
    SELECT * FROM ${table} WHERE ${whereClause};
  `;

  try {
    const [rows] = await query(selectQuery, whereValues);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error selecting data:', error);
  }
}

module.exports = { selectData };