const fs = require('fs');
const path = require('path');

const dirPath = path.resolve(__dirname, "../../database/controlData/visualDatabase/");
const filePath = path.join(dirPath, "databaseCount.json");

function addToDatabaseCount (table, action) {
  try {

    let databaseCount = {};
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf8');
      databaseCount = JSON.parse(rawData);
    }

    if (!databaseCount[table]) {
      databaseCount[table] = { selects: 0, inserts: 0, updates: 0, deletes: 0};
    }

    if (databaseCount[table][action] !== undefined ) {
      databaseCount[table][action]++;
    } else {
      console.warn(`Unrecognized action: "${action}" for table: "${table}".`);
    }

    fs.writeFileSync(filePath, JSON.stringify(databaseCount, null, 2), 'utf8');
  } catch (error) {
    console.error('Error exporting event to log file:', error);
  }
}

function showDatabaseCount () {
  let databaseCount = {};
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    databaseCount = JSON.parse(rawData);
  }
  console.log(
    '-----------------------------------\n' +
    'Database Counter:'
  );

  for (const [table, actions] of Object.entries(databaseCount)) {
    console.log(`Table ${table}:`);
    for (const [action, count] of Object.entries(actions)) {
      console.log(`${action} - ${count}`);
    }
  }
  console.log('-----------------------------------');
  databaseCount = {};
  fs.writeFileSync(filePath, JSON.stringify(databaseCount, null, 2), 'utf8');
}

module.exports = { addToDatabaseCount, showDatabaseCount }