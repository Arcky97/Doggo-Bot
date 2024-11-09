const { Client, StageInstance, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, stageInstance) => {
  try {
    const logChannel = await getLogChannel(client, stageInstance, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}