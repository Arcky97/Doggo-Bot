const { Client, Message } = require('discord.js');
const calculateXpByLevel = require('../../utils/levels/calculateXpByLevel');
const cooldowns = new Set();
const { getUserLevel, setUserLevelInfo } = require('../../../database/levelSystem/setLevelSystem');
const { getLevelSettings, getAnnounceChannel, getXpCoolDown, getAnnouncePing } = require('../../../database/levelSystem/setLevelSettings');
const calculateMultiplierXp = require('../../utils/levels/calculateMultiplierXp');
const createAnnounceEmbed = require('../../utils/levels/createAnnounceEmbed');
const giveUserLevelRole = require('../../utils/levels/giveUserLevelRole');
const { deleteData } = require('../../../database/controlData/deleteData');
const calculateLevelByXp = require('../../utils/levels/calculateLevelByXp');

module.exports = async (client, message) => {
  const guildId = message.guild.id;
  if (!message.inGuild() || message.author.bot || cooldowns.has(guildId + message.author.id)) return;
  try {
    const user = await getUserLevel(guildId, message.author.id);
    const levelSettings = await getLevelSettings(guildId);
    const xpToGive = calculateMultiplierXp(levelSettings, message);
    const xpCooldown = await getXpCoolDown(guildId) * 1000;
    if (xpToGive === 0) return;
    let newLevel = 0;
    let newXp = 0;
    const channel = client.channels.cache.get(await getAnnounceChannel(guildId)) || message.channel;
    //await deleteData('LevelSettings', { guildId: guildId});
    if (user) {
      const userLevelXp = calculateXpByLevel(user.level)
      newXp = user.xp + xpToGive;
      const ping = await getAnnouncePing(guildId) === 1 ? `<@${message.author.id}>` : ''
      newLevel = user.level;
      let userInfo;
      if (newXp > userLevelXp) {
        newLevel = calculateLevelByXp(newXp);
        userInfo = {
          level: newLevel,
          xp: newXp,
          color: user.color
        }
        let embed = await createAnnounceEmbed(message, userInfo);
        await channel.send({content: ping, embeds: [ embed ]});
        await giveUserLevelRole(guildId, message.member, userInfo);
      }
      cooldowns.add(guildId + message.author.id);
      setTimeout(() => {
        cooldowns.delete(guildId + message.author.id);
      }, xpCooldown);
    } else {
      newLevel = 0;
      newXp = xpToGive;
      cooldowns.add(guildId + message.author.id);
      setTimeout(() => {
        cooldowns.delete(guildId + message.author.id);
      }, xpCooldown);
    }
    await setUserLevelInfo(user, { guildId: guildId, memberId: message.author.id }, { level: newLevel, xp: newXp })

  } catch (error) {
    console.log(`Error giving xp:`, error);
  }
}