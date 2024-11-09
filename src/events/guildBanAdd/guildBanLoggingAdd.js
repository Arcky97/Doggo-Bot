const { Client, GuildBan, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, ban) => {
  try {
    const logChannel = await getLogChannel(client, ban.guild.id, 'member');
    if (!logChannel) return;
  } catch (error) {
    console.error(error);
  }
}