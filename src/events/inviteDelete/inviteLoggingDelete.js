const { Client, Invite, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, invite) => {
  try {
    const logChannel = await getLogChannel(client, invite.guild.id, 'server');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}