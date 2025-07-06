import databaseLogging from "../logging/databaseLogging.js";
import { query } from "../../managers/databaseManager.js";

export async function deleteData(table, key, data) {
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
    databaseLogging(`Data Deleted from ${table} table.`);
  } catch (error) {
    console.error(`Error Deleting data in ${table} table:`, error);
    databaseLogging(`Error Deleting data from ${table} table.`);
  }
}