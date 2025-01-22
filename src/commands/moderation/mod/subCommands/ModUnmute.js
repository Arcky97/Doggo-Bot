
const { addModerationLogs, getModerationLogs } = require("../../../../../database/moderationLogs/setModerationLogs");
const { createInfoEmbed, createErrorEmbed } = require("../../../../utils/embeds/createReplyEmbed");
const checkLogTypeConfig = require("../../../../utils/logging/checkLogTypeConfig");
const {  createUnmuteLogEmbed } = require("../../../../utils/sendModerationLogEvent");
const formatTime = require("../../../../utils/formatTime");
const { removeModerationTask } = require("../../../../handlers/moderationTasks");
const createMissingPermissionsEmbed = require("../../../../utils/createMissingPermissionsEmbed");

module.exports = async (interaction, guild, member, mod, reason, nextId, logChannel, beginTime, muteRole) => {
  const embeds = [];
  let title, description, fetchMember;
  let fields = [];

  const permEmbed = await createMissingPermissionsEmbed(interaction, mod, ['ManageRoles']);

  if (permEmbed) {
    embeds.push(permEmbed);
    return { embeds }; 
  }

  try {
    const unmuteLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'unmutes' });
    if (member) {
      if (member.roles.cache.has(muteRole)) {
        await addModerationLogs({ guildId: guild.id, userId: member.id, modId: mod.id, action: 'unmute', reason: reason, status: 'completed', logging: unmuteLogging, logChannel: logChannel?.id, date: beginTime });
        await member.roles.remove(muteRole);
        const muteLog = await getModerationLogs({ guildId: guild.id, userId: member.id, action: 'mute' });
        const unmuteLog = await getModerationLogs({ guildId: guild.id, userId: member.id, action: 'unmute' });
        let timeMuted;
        if (!muteLog || (unmuteLog && unmuteLog?.date > muteLog?.date)) {
          timeMuted = 'unknown time';
        } else {
          timeMuted = await formatTime(muteLog?.date, false) || 'unknown time';
        }
        if (muteLog && timeMuted !== 'unknown time') await removeModerationTask(muteLog.id, guild.id, muteLog.timeoutId);
        title = `Unmuted ${member.user.username}`;
        description = `${member} has been taken away the <@&${muteRole}> Role and is no longer Muted.\n Muted for ${timeMuted}.`;
        fields.push({
          name: `ID: ${nextId}`,
          value:  `**Member:** ${member}\n` +
                  `**Unmuted by:** <@${mod.id}>\n` +
                  `**Reason:** ${reason}\n` +
                  `**Time Muted:** ${timeMuted}.`
        });
        if (unmuteLogging) await createUnmuteLogEmbed(interaction.guild, logChannel, fields);
      } else {
        embeds.push(createInfoEmbed({
          int: interaction,
          title: 'Cannot Unmute Member',
          descr: `${member} cannot be Unmuted as they were not muted.`
        }));
      }
    } else {
      fetchMember = await client.users.fetch(interaction.options.get('member').value);
      embeds.push(createInfoEmbed({
        int: interaction,
        title: 'Cannot Unmute Member',
        descr: `${fetchMember} cannot be Unmuted as they are not in this Server.`                
      }));
    }
  } catch (error) {
    console.error('Error running the unmute Command', error);
    embeds.push(createErrorEmbed({
      int: interaction,
      descr: 'There went something wrong while using the Unmute Command. \nPlease try again later.'
    }));
  }
  return { title, description, embeds }
}