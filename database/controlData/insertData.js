/*

async function insertData(table, data, uniqueKeys) {
  const columns = Object.keys(data);
  const placeHolder = columns.map(() => '?').join(', ');
  const updates = columns.map(col => `${col} = VALUES(]{col})`).join(', ');

  console.log(columns);

  const insertQuery = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeHolder})
  `
}

module.exports = { insertData };*/