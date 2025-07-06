import { EmbedBuilder } from "discord.js";


export default (levSettings, premiumServer) => {
  const xpSettings = JSON.parse(levSettings.xpSettings);
  const embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Level System XP Settings')
    .setDescription('All XP Settings are shown below.')
    .setFields(
      {
        name: 'XP Values',
        value: `-**Step:** \`${xpSettings.step}\`\n` +
               `-**Min XP:** \`${xpSettings.min}\`\n` +
               `-**Max XP:** \`${xpSettings.max}\`\n`,
        inline: true,
      },
      {
        name: 'XP Cooldown',
        value: `${levSettings.xpCooldown} seconds`,
        inline: true
      },
      {
        name: 'XP Type',
        value: levSettings.xpType,
        inline: true 
      }
    )
  .setTimestamp()
  if (premiumServer) {
    embed.addFields({
      name: 'Message Length Based XP',
      value: `-**Min Length:** \`${xpSettings.minLength}\`\n` +
             `-**Max Length:** \`${xpSettings.maxLength}\``,
      inline: true
    });
  }         
  return embed;
};