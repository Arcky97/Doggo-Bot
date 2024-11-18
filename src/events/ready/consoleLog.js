const setActivity = require("../../utils/setActivity");

module.exports = (client) => {
  console.log(
    `'${client.user.username}' is ready!\n` + 
    '-----------------------------------'
  );
  setActivity(client);
};