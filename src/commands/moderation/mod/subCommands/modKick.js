import { addModerationLogs } from "../../../../managers/moderationLogsManager.js";
import { updateUserAttempts } from "../../../../managers/userStatsManager.js";
import createMissingPermissionsEmbed from "../../../../utils/createMissingPermissionsEmbed.js";
import { createInfoEmbed, createErrorEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import getCmdReplyKey from "../../../../utils/getCmdReplyKey.js";
import getCommandReply from "../../../../utils/getCommandReply.js";
import getUserClass from "../../../../utils/getUserClass.js";
import checkLogTypeConfig from "../../../../managers/logging/checkLogTypeConfig.js";
import { createKickLogEmbed } from "../../../../services/moderationLogService.js";
import { findJsonFile } from "../../../../managers/jsonDataManager.js";

const commandReplies = findJsonFile('commandReplies.json', 'data');

export default async (interaction, guild, member, mod, reason, nextId, logChannel, beginTime) => {
  const embeds = [];
  let title, description, fetchMember;
  let fields = [];

  const permEmbed = await createMissingPermissionsEmbed(interaction, mod, ['KickMembers']);
  if (permEmbed) {
    embeds.push(permEmbed);
    return { embeds };
  }

  let [userClass, targetClass] = getUserClass([{ member: mod, perms: ['KickMembers'] }, { member: member, perms: ['KickMembers'] }]);
  if (targetClass === userClass && mod.id === member.id) targetClass = 'self';
  let replies = commandReplies['kick']?.[targetClass]?.[userClass];
  const kickKey = getCmdReplyKey(targetClass, mod.id, member?.id);

  await updateUserAttempts(guild.id, mod.id, member?.id, 'kick', kickKey, replies?.length > 1);

  if (!replies) {
    try {
      const kickLogging = await checkLogTypeConfig({ guildId: guild.id, type: 'moderation', option: 'kicks'});
      if (member) {
        // Kick Member from the Server.
        await addModerationLogs({ guildId: guild.id, userId: member.id, modId: mod.id, action: 'kick', reason: reason, logging: kickLogging, date: beginTime });
        await member.kick({ reason: reason });
        title = `Kicked ${member.user.username}`;
        description = `${member} has been kicked from the Server.`;
        fields.push({
          name: `ID: ${nextId}`,
          value:  `**Member:** ${member}\n` +
                  `**Kicked by:** ${mod}\n` +
                  `**Reason:** ${reason}`
        });
        if (kickLogging) await createKickLogEmbed(interaction.guild, logChannel, fields);
      } else {
        // Member not in the Server (anymore).
        fetchMember = await client.users.fetch(interaction.options.get('member').value);
        embeds.push(createInfoEmbed({
          int: interaction,
          title: 'Cannot kick member',
          descr: `${fetchMember} cannot be kicked from the Server as they are not in the Server (anymore).`
        }));
      }

    } catch (error) {
      console.error('Error running the kick Command:', error);
      embeds.push(createErrorEmbed({
        int: interaction,
        descr: 'There went something wrong while using the Kick Command. \nPlease try again later.'
      }));
    }
  } else {
    const response = await getCommandReply(guild.id, mod.id, member.id, 'kick', kickKey, replies);
    embeds.push(createInfoEmbed({
      int: interaction,
      title: response.title,
      descr: response.description
    }));
  }
  return { title, description, embeds };
}