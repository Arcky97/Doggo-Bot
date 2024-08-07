const { deleteData } = require("./deleteData");
const { insertData } = require("./insertData");
const { updateData } = require("./updateData");
  
async function setData(table, data, action) {
  switch(action) {
  case "insert":
    insertData(table, data);
    break;
  case "update":
    updateData(table, data);
    break;
  case "delete":
    deleteData(table, data);
    break;
  default:
    return `${action} is not a valid Action!`;
  };
}

module.exports = { setData };