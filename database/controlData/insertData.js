const { addToDatabaseCount } = require("../../src/handlers/DatabaseCount");
const exportToDatabaseLogging = require("../../src/handlers/exportToDatabaseLogging");
const { query } = require("../db");

async function insertData(table, key, data) {
  const combinedData = { ...key, ...data };
  
  const columns = Object.keys(combinedData);
  const placeholders = columns.map(() => '?').join(', ');

  const insertQuery = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
  `;

  try {
    await query(insertQuery, Object.values(combinedData));
    exportToDatabaseLogging(`Data Inserted in ${table} table.`);
    addToDatabaseCount (table, "inserts");
  } catch (error) {
    console.error(`Error inserting data in ${table} table:`, error);
    exportToDatabaseLogging(`Error Inserting data in ${table} table.`)
  }
}

module.exports = { insertData };