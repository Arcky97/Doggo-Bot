const { query } = require("../db");

async function deleteData(table, key, data) {
  let deleteQuery;
  const whereClause = Object.keys(key).map(key => `${key} = ?`).join(' AND ');
  const whereValues = Object.values(key);

  if (data) { // delete an element
    const whereData = Object.keys(data).map(col => `${col} = NULL`).join(', ');
    deleteQuery = `
      UPDATE ${table}
      SET ${whereData}
      WHERE ${whereClause};
    `;
  } else { // delete entire row
    deleteQuery = `
      DELETE FROM ${table}
      WHERE ${whereClause};
    `;
  }

  try {
    await query(deleteQuery, whereValues);
    console.log("Data was successfully deleted");
  } catch (error) {
    console.error('Error deleting data from database:', error);
  }
}

module.exports = { deleteData };