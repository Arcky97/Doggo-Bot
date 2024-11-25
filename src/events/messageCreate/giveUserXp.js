const { Client, Message } = require('discord.js');
const cooldowns = new Set();
const { getLevelSettings, getXpCoolDown, getXpSettings } = require('../../../database/levelSystem/setLevelSettings');
const calculateMultiplierXp = require('../../utils/levels/calculateMultiplierXp');
const giveUserLevelRole = require('../../utils/levels/giveUserLevelRole');
const sendAnnounceMessage = require('../../utils/levels/sendAnnounceMessage');
const generateUserInfo = require('../../utils/levels/generateUserInfo');

module.exports = async (client, message) => {
  const guildId = message.guild.id;
  if (!message.inGuild() || message.author.bot || cooldowns.has(guildId + message.author.id)) return;
  try{
    const levelSettings = await getLevelSettings(guildId);
    const xpSettings = await getXpSettings(guildId);
    const xpToGive = calculateMultiplierXp({settings: levelSettings, user: message.member, channel: message.channel});
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
      await sendAnnounceMessage(client, message, message.author, userInfo);
      await giveUserLevelRole(guildId, message.member, userInfo);
    }
  } catch (error) {
    console.log(`Error giving xp:`, error);
  }
}