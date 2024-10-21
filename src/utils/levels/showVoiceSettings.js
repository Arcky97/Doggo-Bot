const { EmbedBuilder } = require("discord.js")

module.exports = (levSettings) => {
  let embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Level System Voice Settings')
    .setDescription('all Voice Settings are shown below.')
    .setFields(
      {
        name: 'Voice Enabled',
        value: levSettings.voiceEnable ? 'Yes' : 'No',
        inline: true 
      }
    )
    .setTimestamp()
  return embed;
}