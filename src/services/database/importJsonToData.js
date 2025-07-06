import { query } from '../../managers/databaseManager.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import databaseLogging from '../logging/databaseLogging.js';

export async function importFromDownloads(table) {
  const downloadsFolder = path.join(os.homedir(), 'Downloads');

  const possibleNames = [
    `${table}.json`,
    `${table.toLowerCase()}.json`,
  ];

  let jsonPath = null;

  for (const fileName of possibleNames) {
    const fullPath = path.join(downloadsFolder, fileName);
    if (fs.existsSync(fullPath)) {
      jsonPath = fullPath;
      break;
    }
  }

  if (!jsonPath) {
    console.log(`No JSON file found for table '${table}' in ${downloadsFolder}.`);
    return;
  }

  console.log(`Found file: ${jsonPath}`);
  return jsonPath;
}

/**
 * Imports data from a JSON file into the given database table.
 * 
 * @param {string} table - The name of the table.
 * @param {string} jsonFilePath - Path to the JSON file to import.
 */
export async function importJsonToData(table, jsonFilePath) {
  const isGlobalTable = (table === 'BotReplies' || table === 'PremiumUsersAndGuilds');

  try {
    if (!fs.existsSync(jsonFilePath)) {
      databaseLogging(`JSON file not found at path: ${jsonFilePath}`);
      return;
    }

    const fileData = fs.readFileSync(jsonFilePath, 'utf-8');
    const rows = JSON.parse(fileData);

    if (!Array.isArray(rows)) {
      databaseLogging(`Invalid JSON format in file: ${jsonFilePath}`);
      return;
    }

    let guildId;
    for (const row of rows) {
      guildId = row.guildId;
      const keys = Object.keys(row);
      const placeholders = keys.map(() => '?').join(', ');
      const values = keys.map(key => {
        let value = row[key];

        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(value)) {
          value = new Date(value).toISOString().slice(0, 19).replace('T', ' ');
        }

        return typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
      });

      const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
      await query(sql, values);

      if (!isGlobalTable) {
        databaseLogging(`Data imported for guild ${guildId} into table ${table} from ${jsonFilePath}.`);
      }
    }

    if (isGlobalTable) {
      databaseLogging(`Data imported into table ${table} from ${jsonFilePath}.`);
    }
  } catch (error) {
    console.error('Error importing JSON to database:', error);
    databaseLogging(
      isGlobalTable
        ? `Error importing data to ${table} from ${jsonFilePath}.`
        : `Error importing data for guild ${guildId} to ${table} from ${jsonFilePath}.`
    )
  }
}