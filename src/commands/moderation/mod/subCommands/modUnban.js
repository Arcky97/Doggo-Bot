import { addModerationLogs, getModerationLogs } from "../../../../managers/moderationLogsManager.js";
import { createInfoEmbed, createErrorEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import checkLogTypeConfig from "../../../../managers/logging/checkLogTypeConfig.js";
import { createUnbanLogEmbed } from "../../../../services/moderationLogService.js";
import formatTime from "../../../../utils/formatTime.js";
import { removeModerationTask } from "../../../../tasks/moderationTasks.js";
import createMissingPermissionsEmbed from "../../../../utils/createMissingPermissionsEmbed.js";

export default async (interaction, guild, user, mod, reason, nextId, logChannel, beginTime) => {
  const embeds = [];
  let title, description;
  let fields = [];

  const permEmbed = await createMissingPermissionsEmbed(interaction, mod, ['BanMembers']);

  if (permEmbed) {
    embeds.push(permEmbed);
    return { embeds };
  }
  
  try {
    const banLog = await getModerationLogs({ guildId: guild.id, userId: user.id, action: 'ban' });
    const unbanLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'unbans'});
    const unbanInfo = await interaction.guild.bans.fetch(user.id).catch(() => null);
    if (unbanInfo) {
      // Unban Member.
      await addModerationLogs({ guildId: guild.id, userId: user.id, modId: mod.id, action: 'unban', reason: reason, status: 'completed', logging: unbanLogging, logChannel: logChannel?.id, date: beginTime });
      await interaction.guild.members.unban(user.id, reason);
      const timeBanned = await formatTime(banLog.at(-1)?.date, false) || 'unknown time';
      if (banLog && timeBanned !== 'unknown time') await removeModerationTask(banLog.at(-1).id, guild.id, banLog.at(-1).timeoutId);
      title = `Unbanned ${user.username}`;
      description = `${user} has been unbanned!\n Banned for ${timeBanned}`;
      fields.push({
        name: `ID: ${nextId}`,
        value:  `**User:** ${user}\n` +
                `**Unbanned by:** <@${mod.id}>\n` +
                `**Reason:** ${reason}\n` +
                `**Time Banned:** ${timeBanned}.`
      });
      if (unbanLogging) await createUnbanLogEmbed(interaction.guild, logChannel, fields);
    } else {
      // Member not banned
      embeds.push(createInfoEmbed({
        int: interaction,
        title: `${user.username} not banned`,
        descr: `${user} wasn't banned so they cannot be unbanned from this Server.`
      }));
    }
  } catch (error) {
    console.error('Error running the unban Command:', error);
    embeds.push(createErrorEmbed({
      int: interaction,
      descr: 'There went something wrong while using the Unban Command. \nPlease try again later.'
    }));
  }
  return { title, description, embeds };
}