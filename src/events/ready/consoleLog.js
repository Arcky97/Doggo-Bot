import botActivityService from "../../services/botActivityService.js";

export default () => {
  console.log(
    `'${client.user.username}' is ready! v2025-09-14\n` + 
    '-----------------------------------'
  );
  botActivityService('Bot Started');
};