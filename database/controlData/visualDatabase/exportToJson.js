const { query } = require("../../db.js");
const fs = require('fs');
const path = require('path');

async function exportToJson(table) {
  try {
    const [rows] = await query(`SELECT * FROM ${table}`);
    const jsonData = JSON.stringify(rows, null, 2);

    const filePath = path.join(__dirname, `${table}.json`);

    fs.writeFileSync(filePath, jsonData);
  } catch (error) {
    console.error('Error exporting data to JSON:', error);    
  }
}

module.exports = { exportToJson }