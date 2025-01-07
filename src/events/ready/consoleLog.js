const setActivity = require("../../utils/setActivity");

module.exports = () => {
  console.log(
    `'${client.user.username}' is ready!\n` + 
    '-----------------------------------'
  );
  setActivity();
};