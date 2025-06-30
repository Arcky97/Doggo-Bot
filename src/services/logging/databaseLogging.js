const fs = require('fs');
const path = require('path');
const moment = require("moment");

module.exports = async (event) => {
  /*
  try {
    const dirPath = path.resolve(__dirname, "../../../database");
    const filePath = path.join(dirPath, "databaseLogging.txt");

    const logEntry = `${moment().local().format('YYYY-MM-DD HH:mm:ss')}: ${event}\n`;

    // Append the log entry as plain text, with each event on a new line
    fs.appendFileSync(filePath, logEntry, 'utf8');

  } catch (error) {
    console.error('Error exporting event to log file:', error);
  }*/
};
