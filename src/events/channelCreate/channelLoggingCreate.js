const { Client, GuildChannel, EmbedBuilder } = require('discord.js');
const getLogChannel = require("../../utils//logging/getLogChannel");
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const getChannelTypeName = require('../../utils/logging/getChannelTypeName');

module.exports = async (client, channel) => {
  try {
    
    const logChannel = await getLogChannel(client, channel.guild.id, 'server');
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`${getChannelTypeName(channel)} Created`)
      .setFields(
        {
          name: 'Name',
          value: channel.name 
        },
        {
          name: 'Category',
          value: `${channel.parent?.name || 'None'}`
        }
      )
      .setFooter({
        text: `Channel ID: ${channel.id}`
      })
      .setTimestamp()

    await setEventTimeOut('server', channel.id, embed, logChannel);


  } catch (error) {
    console.error('Failed to log Channel Create!', error);
  }
}