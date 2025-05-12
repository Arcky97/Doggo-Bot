const { EmbedBuilder } = require("discord.js")

module.exports = (levSettings) => {
  const annDef = JSON.parse(levSettings.announceDefaultMessage);
  const annLev = JSON.parse(levSettings.announceLevelMessages)
    .sort((a, b) => a.lv - b.lv)
    .map(data => `- lv. ${data.lv}`)
    .join('\n').trim() || 'none';
  let embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Level System Announcement Settings')
    .setDescription('To view the announcement level up message, use `/levels announcement show`, you can add a specific level optionally otherwise it\'ll show the default message.')
    .setFields(
      {
        name: 'Ping',
        value: levSettings.announcePing ? 'Enabled' : 'Disabled',
        inline: true 
      },
      {
        name: 'Channel',
        value: levSettings.announceChannel !== 'not set' ? `<#${levSettings.announceChannel}>` : 'Not set',
        inline: true 
      },
      {
        name: 'Default Message',
        value: annDef.length > 0 ? 'Custom Used' : 'Default Used',
        inline: true 
      },
      {
        name: 'Level Messages',
        value: annLev,
        inline: true 
      }
    )
    .setTimestamp()
  return embed;
}