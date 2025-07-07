import botActivityService from "../../services/botActivityService.js";

export default () => {
  console.log(
    `'${client.user.username}' is ready! v2025-07-07\n` + 
    '-----------------------------------'
  );
  botActivityService('Bot Started');
};