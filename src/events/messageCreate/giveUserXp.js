const { Client, Message } = require('discord.js');
const calculateXpByLevel = require('../../utils/levels/calculateXpByLevel');
const cooldowns = new Set();
const { getUserLevel, setUserLevelInfo } = require('../../../database/levelSystem/setLevelSystem');
const { getLevelSettings, getAnnounceChannel, getXpCoolDown, getAnnouncePing, getXpSettings } = require('../../../database/levelSystem/setLevelSettings');
const calculateMultiplierXp = require('../../utils/levels/calculateMultiplierXp');
const createAnnounceEmbed = require('../../utils/levels/createAnnounceEmbed');
const giveUserLevelRole = require('../../utils/levels/giveUserLevelRole');
const calculateLevelByXp = require('../../utils/levels/calculateLevelByXp');

module.exports = async (client, message) => {
  const guildId = message.guild.id;
  if (!message.inGuild() || message.author.bot || cooldowns.has(guildId + message.author.id)) return;
  try {
    const user = await getUserLevel(guildId, message.author.id);
    const levelSettings = await getLevelSettings(guildId);
    const xpSettings = await getXpSettings(guildId);
    const xpToGive = calculateMultiplierXp(levelSettings, message, xpSettings);
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
    let newLevel = 0;
    let newXp = 0;
    const channel = client.channels.cache.get(await getAnnounceChannel(guildId)) || message.channel;
    let userInfo;
    const ping = await getAnnouncePing(guildId) === 1 ? `<@${message.author.id}>` : '';
    if (user) {
      const userLevelXp = calculateXpByLevel(user.level, xpSettings);
      newXp = user.xp + xpToGive;
      newLevel = user.level;
      if (newXp > userLevelXp) {
        newLevel = calculateLevelByXp(newXp, xpSettings);
        userInfo = {
          level: newLevel,
          xp: newXp,
          color: user.color
        }
      }
    } else {
      newXp = xpToGive;
      newLevel = calculateLevelByXp(newXp, xpSettings);
      if (newLevel > 0) {
        userInfo = {
          level: newLevel,
          xp: newXp,
          color: '#f97316'
        }
      }
    }

    await setUserLevelInfo(user, { guildId: guildId, memberId: message.author.id }, { level: newLevel, xp: newXp });
    if (userInfo) {
      let embed = await createAnnounceEmbed(guildId, message, userInfo);
      await channel.send({content: ping, embeds: [ embed ]});
      await giveUserLevelRole(guildId, message.member, userInfo);
    }
  } catch (error) {
    console.log(`Error giving xp:`, error);
  }
}