const { getAnnounceChannel, getAnnouncePing } = require("../../../database/levelSystem/setLevelSettings");
const { setUserLevelInfo } = require("../../../database/levelSystem/setLevelSystem");
const calculateLevelByXp = require("./calculateLevelByXp");
const calculateXpByLevel = require("./calculateXpByLevel");
const createAnnounceEmbed = require("./createAnnounceEmbed");
const giveUserLevelRole = require("./giveUserLevelRole");

module.exports = async (guildId, user, userLevelInfo, xpSettings, xpToGive) => {
  let newLevel = 0;
  let newXp = 0;
  const channel = client.channels.cache.get(await getAnnounceChannel(guildId));
  if (!channel) return;
  let newUserInfo;
  const ping = await getAnnouncePing(guildId) === 1 ? `<@${user.id}>` : ''
  if (userLevelInfo) {
    const nextLevelXp = calculateXpByLevel(userLevelInfo.level + 1, xpSettings)
    newXp = userLevelInfo.xp + xpToGive;
    newLevel = userLevelInfo.level;
    if (newXp > nextLevelXp) {
      newLevel = calculateLevelByXp(newXp, xpSettings);
      newUserInfo = {
        level: newLevel,
        xp: newXp,
        color: userLevelInfo.color
      }
    }
  } else {
    newXp = xpToGive;
    newLevel = calculateLevelByXp(newXp, xpSettings);
    if (newLevel > 0) {
      newUserInfo = {
        level: newLevel,
        xp: newXp,
        color: '#f97316'
      }
    }
  }
  await setUserLevelInfo(userLevelInfo, { guildId: guildId, memberId: user.id }, { level: newLevel, xp: newXp })
  if (newUserInfo) {
    let embed = await createAnnounceEmbed(guildId, user, newUserInfo);
    await channel.send({content: ping, embeds: [ embed ]});
    await giveUserLevelRole(guildId, user, newUserInfo);
  }
}