import { EmbedBuilder } from "discord.js";

export default (levSettings) => {
  let voiceEnable = levSettings.voiceEnable;
  let voiceMult = levSettings.voiceMultiplier;
  let voiceCooldown = levSettings.voiceCooldown;
  let embed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Level System Voice Settings')
    .setDescription('all Voice Settings are shown below. (Voice Cooldown and Multiplier are only shown if Voice XP is enabled.)')
    .setFields(
      {
        name: 'Voice XP',
        value: voiceEnable ? 'Enabled' : 'Disabled',
        inline: true 
      }
    )
    .setTimestamp()
    if (voiceEnable) {
      embed.addFields(
        {
          name: 'Voice Multiplier',
          value: `\`${voiceMult}%\``,
          inline: true
        },
        {
          name: 'Voice Cooldown',
          value: voiceCooldown > 1 ? `${voiceCooldown} Seconds` : `${voiceCooldown} Second`,
          inline: true  
        }
      )
    }
  return embed;
}