const { query } = require("../db");

async function insertData(table, data, uniqueKeys) {
  const columns = Object.keys(data);
  const placeholders = columns.map(() => '?').join(', ');
  const insertQuery = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders});
  `;

  try {
    await query(insertQuery, Object.values(data));
    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
  }

}

module.exports = { insertData };