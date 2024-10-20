const { query } = require("../db");

async function selectData(table, keys, selectAll = false) {
  const whereClause = Object.keys(keys).map(key => `${key} = ?`).join(' AND ');
  const whereValues = Object.values(keys);
  const selectQuery = `
    SELECT * FROM ${table} WHERE ${whereClause};
  `;

  try {
    const [rows] = await query(selectQuery, whereValues);
    if (!selectAll) {
      return rows.length > 0 ? rows[0] : null;
    } else {
      return rows;
    }
  } catch (error) {
    console.error('Error selecting data:', error);
  }
}

module.exports = { selectData };