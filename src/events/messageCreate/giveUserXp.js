const { Client, Message } = require('discord.js');
const cooldowns = new Set();
const { getLevelSettings, getXpCoolDown, getXpSettings } = require('../../../database/levelSystem/setLevelSettings');
const calculateMultiplierXp = require('../../utils/levels/calculateMultiplierXp');
const giveUserLevelRole = require('../../utils/levels/giveUserLevelRole');
const sendAnnounceMessage = require('../../utils/levels/sendAnnounceMessage');
const generateUserInfo = require('../../utils/levels/generateUserInfo');
const { getPremiumById } = require('../../../database/PremiumUsersAndGuilds/setPremiumUsersAndGuilds');
const { setBotStats } = require('../../../database/BotStats/setBotStats');

module.exports = async (message) => {
  const guildId = message.guild.id;
  if (!message.inGuild() || message.author.bot || cooldowns.has(guildId + message.author.id)) return;

  try {
    await setBotStats(guildId, 'event', { event: 'messageCreate' });

    const premiumServer = await getPremiumById(guildId);
    const levelSettings = await getLevelSettings(guildId);
    const xpSettings = await getXpSettings(guildId);
    const xpToGive = calculateMultiplierXp({settings: levelSettings, user: message.member, channel: message.channel, message: message, premiumServer: premiumServer });
    const xpCooldown = await getXpCoolDown(guildId) * 1000;
    
    if (xpToGive === 0) return;

    const cooldownKey = `XPCD${guildId + message.author.id}`
    if (!cooldowns.has(cooldownKey)) {
      cooldowns.add(cooldownKey);
      setTimeout(() => {
        cooldowns.delete(cooldownKey);
      }, xpCooldown);
    } else {
      return;
    }

    const userInfo = await generateUserInfo(guildId, message.author, xpToGive, xpSettings);

    if (userInfo) {
      await sendAnnounceMessage(message, message.author, userInfo);
      await giveUserLevelRole(guildId, message.member, userInfo);
    }
  } catch (error) {
    console.log(`Error giving xp:`, error);
  }
}