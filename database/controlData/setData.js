const { deleteData } = require("./deleteData");
const { insertData } = require("./insertData");
const { updateData } = require("./updateData");
  
async function setData(table, key, data, action) {
  switch(action) {
  case "insert":
    console.log("let's call the insertData function.");
    await insertData(table, key, data);
    break;
  case "update":
    console.log("let's call the updateData function.");
    await updateData(table, key, data);
    break;
  case "delete":
    console.log("let's call the deleteData function.");
    await deleteData(table, key, data);
    break;
  default:
    return `${action} is not a valid Action!`;
  };
}

module.exports = { setData };