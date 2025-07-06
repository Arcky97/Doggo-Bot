import databaseLogging from "../logging/databaseLogging.js";
import { query } from "../../managers/databaseManager.js";

export async function insertData(table, key, data) {
  const combinedData = { ...key, ...data };
  const columns = Object.keys(combinedData);
  const placeholders = columns.map(() => '?').join(', ');

  const insertQuery = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
  `;

  try {
    await query(insertQuery, Object.values(combinedData));
    databaseLogging(`Data Inserted in ${table} table.`);
  } catch (error) {
    console.error(`Error inserting data in ${table} table:`, error);
    databaseLogging(`Error Inserting data in ${table} table.`)
  }
}