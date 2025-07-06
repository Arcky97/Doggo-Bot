import { setBotStats } from "../../managers/botStatsManager.js";
import { getGuildSettings, setGuildLoggingConfig } from "../../managers/guildSettingsManager.js";
import { createSuccessEmbed, createErrorEmbed, createWarningEmbed, createNotDMEmbed } from "../../services/embeds/createReplyEmbed.js";

export default {
  name: 'fix',
  description: 'fix some stuff in the database.',
  devOnly: true,
  callback: async (interaction) => {
    await interaction.deferReply();

    if (!interaction.inGuild()) return interaction.editReply({
      embeds: [createNotDMEmbed(interaction)]
    });

    let embed;
    const guildId = interaction.guild.id;

    if (interaction.user.id === '763287145615982592') {
      embed = createWarningEmbed({
        int: interaction, 
        title: 'Bad Zeta!', 
        descr: `No ${interaction.user}! Don't try to fix what's broken!`
      });
    } else {
      try {
        for (const guild of client.guilds.cache.values()) {
          const settings = await getGuildSettings(guild.id);
          const voiceConfig = { 
            ...JSON.parse(settings.voiceConfig),
            mutes: false,
            unmutes: false,
            deafens: false,
            undeafens: false
          };
          await setGuildLoggingConfig(guild.id, 'voice', voiceConfig);
        }
        embed = createSuccessEmbed({ 
          int: interaction, 
          title: 'Table Data Fixed', 
          descr: 'The following table data has been fixed successfully: \n- VoiceConfig new settings'
        });
      } catch (error) {
        embed = createErrorEmbed({int: interaction, descr: `Something went wrong fixing the Database! Try again later! ${error}`});
      }
    }
    interaction.editReply({ embeds: [embed] });
    await setBotStats(guildId, 'command', { category: 'developing', command: 'fix' });
  }
};

const renameKeyPreserveOrder = (obj, oldKey, newKey) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      key === oldKey ? [newKey, value] : [key, value]
    )
  );
};