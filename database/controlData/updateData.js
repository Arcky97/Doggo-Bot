const { query } = require("../db");

async function updateData(table, key, data) {
  const setClause = Object.keys(data)
    .map((column) => `${column} = ?`)
    .join(', ');

  const whereClause = Object.keys(key)
    .map((column) => `${column} = ?`)
    .join(' AND ');

  const values = [...Object.values(data), ...Object.values(key)];

  const updateQuery = `
    UPDATE ${table}
    SET ${setClause}
    WHERE ${whereClause};
  `;

  try {
    await query(updateQuery, values);
    console.log(`Data updated in ${table} table.`);
  } catch (error) {
    console.error(`Error updating data in ${table} table:`, error);
  }
}

module.exports = { updateData };