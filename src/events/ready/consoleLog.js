import botActivityService from "../../services/botActivityService.js";

export default () => {
  console.log(
    `'${client.user.username}' is ready!\n` + 
    '-----------------------------------'
  );
  botActivityService('Bot Started');
};