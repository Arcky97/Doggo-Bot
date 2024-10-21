const { EmbedBuilder } = require("discord.js")

module.exports = (blackListRoles, blackListChannels) => {
  let embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Level System Black List Settings')
    .setDescription('All Channels and Roles that were added to the black list are shown below.')
    .setFields(
      {
        name: 'Black Listed Roles',
        value: blackListRoles,
        inline: true
      },
      {
        name: 'Black Listed Channels',
        value: blackListChannels,
        inline: true 
      }
    )
    .setTimestamp()
  return embed;
}