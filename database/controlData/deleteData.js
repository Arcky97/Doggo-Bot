const { query } = require("../db");

async function deleteData(table, key, data) {
  let deleteQuery;
  const whereClause = Object.keys(key)[0]; 
  const whereValues = [Object.values(key)[0]]; 

  if (data) { // delete an element
    const whereData = Object.keys(data)[0]
    deleteQuery = `
      UPDATE ${table}
      SET ${whereData} = NULL
      WHERE ${whereClause} = ?;
    `;
  } else { // delete entire row
    deleteQuery = `
      DELETE FROM ${table}
      WHERE ${whereClause} = ?;
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
