import { query } from '../../managers/databaseManager.js';
import fs from 'fs';
import path from 'path';
import databaseLogging from "../logging/databaseLogging.js";

/**
 * 
 * @param {string} table - The name of the table.
 * @param {string|null} guildId - Guild ID (null for all data or global tables).
 * @param {boolean} returnFile - returns as a json file when true.
 * @returns 
 */
export default async (table, guildId, returnFile = false) => {
  const exportEntireTable = (table === 'BotReplies' || table === 'PremiumUsersAndGuilds' || returnFile);
  try {
    // Query data for the specific guild, unless it's the BotReplies Table.
    const queryCondition = exportEntireTable ? '' : ' WHERE guildId = ?';
    const [rows] = await query(`SELECT * FROM ${table}${queryCondition}`, exportEntireTable ? [] : [guildId] );

    if (rows.length === 0) {
      databaseLogging(
        exportEntireTable 
          ? `No data found in table ${table}.`
          : `No data found for guild ${guildId} in table ${table}.`
      );
      return returnFile ? null : undefined;
    }

    // Parse JSON-like strings in the rows
    for (const row of rows) {
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          const value = row[key];
          const validPlaceholder = ['{user name}', '{user avatar}', '{server name}', '{server icon}'];
          if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('[')) && !validPlaceholder.includes(value)) {
            try {
              row[key] = JSON.parse(value);
            } catch (error) {
              console.log(`Invalid JSON format in key ${key}:`, value);
            }
          }
        }
      }
    }

    // Convert data to JSON with identation.
    const jsonData = JSON.stringify(rows, null, 2);

    // Handle returnFile logic
    if (returnFile) {
      const fileName = `${table}.json`;
      return { buffer: Buffer.from(jsonData, "utf8"), fileName };
    }

    // Define the directory path for the table.
    const directoryPath = path.join(__dirname, `../../../database/${table}`);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define the file path.
    const fileName = exportEntireTable ? `${table}.json` : `${table}_${guildId}.json`;
    const filePath = path.join(directoryPath, fileName);

    // Write data to the file;
    fs.writeFileSync(filePath, jsonData, 'utf8');
    databaseLogging(
      exportEntireTable
        ? `Data exported to ${filePath}.`
        : `Data for guild ${guildId} exported to ${filePath}`
    );
  } catch (error) {
    //console.error('Error exporting data to JSON:', error);    
    databaseLogging(
      exportEntireTable
        ? `Error exporting data from ${table} to JSON.`
        : `Error exporting data for guild ${guildId} from ${table} to JSON.`
    );
  }
}