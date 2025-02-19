const { EmbedBuilder } = require("discord.js")

module.exports = (levSettings, globalMult, roleMults, channelMults, categoryMults) => {
  let embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Level System Multiplier Settings')
    .setDescription('All multipliers set in this Server are shown below.' + 
      '\nThe max stack of multipliers is `1000%`.' +
      '\n- Global + Roles Stack' +
      '\n- Channel + Roles Stack' +
      '\n- Global + Channel don\'t stack')
    .setFields(
      {
        name: 'Global Multiplier',
        value: levSettings.globalMultiplier ? `\`${globalMult}%\`` : 'not set',
      },
      {
        name: 'Role Multipliers',
        value: roleMults,
        inline: true 
      },
      {
        name: 'Category Multipliers',
        value: categoryMults,
        inline: true
      },
      {
        name: 'Channel Multipliers',
        value: channelMults,
        inline: true
      }
    )
    .setTimestamp()
  return embed;
}