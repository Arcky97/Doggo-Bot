const { addToDatabaseCount } = require("../../src/handlers/DatabaseCount");
const exportToDatabaseLogging = require("../../src/handlers/exportToDatabaseLogging");
const { query } = require("../db");

async function selectData(table, keys = {}, selectAll = false) {
  let whereClause = '';
  let whereValues = [];

  if (Object.keys(keys).length > 0) {
    whereClause = 'WHERE ' + Object.keys(keys).map(key => `${key} = ?`).join(' AND ');
    whereValues = Object.values(keys);
  }
  
  const selectQuery = `
    SELECT * FROM ${table} ${whereClause};
  `;

  try {
    const [rows] = await query(selectQuery, whereValues);
    if (!selectAll) {
      return rows.length > 0 ? rows[0] : null;
    } else {
      return rows;
    }
  } catch (error) {
    console.error(`Error selecting data from ${table} table:`, error);
    exportToDatabaseLogging(`Error Selecting data from ${table} table.`);
    addToDatabaseCount(table, "selects");
    return null;
  }
}

module.exports = { selectData };