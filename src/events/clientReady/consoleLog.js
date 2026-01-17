import botActivityService from "../../services/botActivityService.js";

export default () => {
  console.log(
    `'${client.user.username}' is ready! v2026-01-17\n` + 
    '-----------------------------------'
  );
  botActivityService('Bot Started');
};