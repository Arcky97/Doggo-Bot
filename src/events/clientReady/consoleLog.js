import botActivityService from "../../services/botActivityService.js";

export default () => {
  console.log(
    `'${client.user.username}' is ready! v2026-02-01\n` + 
    '-----------------------------------'
  );
  botActivityService('Bot Started');
};