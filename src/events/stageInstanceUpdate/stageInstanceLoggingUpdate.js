const { Client, StageInstance, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');

module.exports = async (client, oldStageInstance, newStageInstance) => {
  try {
    const logChannel = await getLogChannel(client, oldStageInstance.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}