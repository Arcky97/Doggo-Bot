import botActivityService from "../../services/botActivityService.js";

export default () => {
  console.log(
    `'${client.user.username}' is ready! v2025-08-18\n` + 
    '-----------------------------------'
  );
  botActivityService('Bot Started');
};