const botActivityService = require("../../services/botActivityService");

module.exports = () => {
  console.log(
    `'${client.user.username}' is ready!\n` + 
    '-----------------------------------'
  );
  botActivityService();
};