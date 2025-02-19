const { addToDatabaseCount } = require("../../managers/databaseCountManager");
const databaseLogging = require("../logging/databaseLogging");
const { query } = require("../../managers/databaseManager");


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
    databaseLogging(`Data Updated in ${table} table.`);
    addToDatabaseCount(table, "updates");
  } catch (error) {
    console.error(`Error updating data in ${table} table:`, error);
    databaseLogging(`Error Updating data in ${table} table.`)
  }
}

module.exports = { updateData };