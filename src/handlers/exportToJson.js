const { query } = require("../../database/db.js");
const fs = require('fs');
const path = require('path');
const exportToDatabaseLogging = require("./exportToDatabaseLogging.js");

module.exports = async (table, guildId) => {
  const botRepliesOrPremium = (table === 'BotReplies' || table === 'PremiumUsersAndGuilds');
  try {
    // Query data for the specific guild, unless it's the BotReplies Table.
    const queryCondition = botRepliesOrPremium ? '' : ' WHERE guildId = ?';
    const [rows] = await query(`SELECT * FROM ${table}${queryCondition}`, botRepliesOrPremium ? [] : [guildId] );

    if (rows.length === 0) {
      exportToDatabaseLogging(
        botRepliesOrPremium 
          ? `No data found in table ${table}.`
          : `No data found for guild ${guildId} in table ${table}.`
      );
      return;
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

    // Define the directory path for the table.
    const directoryPath = path.join(__dirname, `../../database/controlData/visualDatabase/${table}`);
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define the file path.
    const fileName = botRepliesOrPremium ? `${table}.json` : `${table}_${guildId}.json`;
    const filePath = path.join(directoryPath, fileName);

    // Write data to the file;
    fs.writeFileSync(filePath, jsonData, 'utf8');
    exportToDatabaseLogging(
      botRepliesOrPremium
        ? `Data exported to ${filePath}.`
        : `Data for guild ${guildId} exported to ${filePath}`
    );
  } catch (error) {
    console.error('Error exporting data to JSON:', error);    
    exportToDatabaseLogging(
      botRepliesOrPremium
        ? `Error exporting data from ${table} to JSON.`
        : `Error exporting data for guild ${guildId} from ${table} to JSON.`
    );
  }
}