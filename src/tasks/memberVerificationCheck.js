import cron from 'node-cron';
import { addModerationLogs, nextModerationLogId } from '../managers/moderationLogsManager.js';
import checkLogTypeConfig from '../managers/logging/checkLogTypeConfig.js';
import getLogChannel from '../managers/logging/getLogChannel.js';
import { createVerifyKickLogEmbed } from '../services/moderationLogService.js';

console.log(
  'Initializing Member Verification Check\n' +
  '-----------------------------------'
);

const failed = "Member Verification Check Failed";

cron.schedule('0 0 * * *', async () => {
  console.log(
    '-----------------------------------\n' +
    'Member Verification Check Started'
  );

  const guildId = '925765418545741854';
  const now = new Date();
  const guild = client.guilds.cache.find(guild => guild.id === guildId);
  if (!guild) {
    console.log('Guild not found, ending Member Verification Check');
    return;
  }
  const kickLogging = await checkLogTypeConfig({ 
    guildId: guildId, 
    type: 'moderation', 
    option: 'kicks'
  });

  const reason = "Automatic kick due to not verified within 2 weeks after joining."
  const fields = [];

  const members = await guild.members.fetch();
  let count = 0;
  let nextId = await nextModerationLogId();
  for (const member of members.values()) {
    if (member.roles.cache.has('926211744890777601')) {
      const joinedAt = member.joinedAt;
      const diffMs = now - joinedAt;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays >= 14) {
        try {
          await addModerationLogs({ 
            guildId: guildId, 
            userId: member.id, 
            modId: client.user.id, 
            action: 'kick', 
            reason: reason, 
            logging: kickLogging, 
            date: now 
          });
        } catch (error) {
          console.error(`Error adding Moderation Log for Member ${member.id}:`, error);
          console.log(failed);
        }

        try {
          await member.kick(reason);
          console.log(`Kicked member ${member}`);
        } catch (error) {
          console.error(`Error kicking member ${member.id}:`, error);
          console.log(failed);
        }
        
        fields.push({
          name: `ID: ${nextId}`,
          value:  
            `**Member:** ${member}\n` +
            `**Kicked by:** ${client.user}\n` +
            `**Reason:** ${reason}`
        });
        nextId++;
        count++;
      }
    }
  };
  if (kickLogging && fields.length > 0) {
    try {
      const logChannel = await getLogChannel(guild.id, 'moderation', true);
      const chunkSize = 25;
      for (let i = 0; i < fields.length; i += chunkSize) {
        const chunk = fields.slice(i, i + chunkSize);
        try {
          await createVerifyKickLogEmbed(guild, logChannel, chunk);
        } catch (error) {
          console.error("Error while trying to send Embed:", error);
          console.log(failed);
        }
      }
    } catch (error) {
      console.error("Error while fetching Moderation Logging Channel:", error);
      console.log(failed);
    }
  }
  console.log(
    '-----------------------------------\n' +
    `${count === 0 ? "No Members kicked" : `${count} Member${count > 1 ? 's' : ''} kicked`}\n` +
    '-----------------------------------\n' +
    'Member Verification Check Finished'
  );
});