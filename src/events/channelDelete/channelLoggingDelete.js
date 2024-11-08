const { EmbedBuilder } = require("discord.js");
const getLogChannel = require("../../utils/getLogChannel");
const setEventTimeOut = require("../../handlers/setEventTimeOut");
const getChannelTypeName = require("../../utils/getChannelTypeName");


module.exports = async (client, channel) => {
  try {
    
    const logChannel = await getLogChannel(client, channel.guild.id, 'server');
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(`Channel Deleted: ${channel.name}`)
      .setFields(
        {
          name: 'Name',
          value: channel.name 
        },
        {
          name: 'Type',
          value: `${getChannelTypeName(channel)}`
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

    await setEventTimeOut('channel', channel.id, embed, logChannel);

    console.log(`The channel ${channel.name} with ID: ${channel.id} was deleted in Server ${channel.guild.id}.`);

  } catch (error) {
    console.error('Failed to log Channel Delete!', erorr);
  }
}