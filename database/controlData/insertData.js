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
    console.log(`Data inserted in ${table} table.`);
  } catch (error) {
    console.error(`Error inserting data in ${table} table:`, error);
  }
}

module.exports = { insertData };