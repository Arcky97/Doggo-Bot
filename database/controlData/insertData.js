const { query } = require("../db");

async function insertData(table, key, data) {
  const combinedData = { ...key, ...data };
  
  const columns = Object.keys(combinedData);
  const placeholders = columns.map(() => '?').join(', ');

  console.log(Object.values(combinedData));

  const insertQuery = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
  `;

  try {
    await query(insertQuery, Object.values(combinedData));
    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

module.exports = { insertData };