const { Client, Message, EmbedBuilder } = require('discord.js');
const calculateLevelXp = require('../../utils/levels/calculateLevelXp');
const cooldowns = new Set();
const { getUserLevel, setUserLevelInfo } = require('../../../database/levelSystem/setLevelSystem');
const { getLevelSettings, getAnnounceChannel } = require('../../../database/levelSystem/setLevelSettings');
const calculateMultiplierXp = require('../../utils/levels/calculateMultiplierXp');
const createAnnounceEmbed = require('../../utils/levels/createAnnounceEmbed');

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot || cooldowns.has(message.guild.id + message.author.id)) return;
  const user = await getUserLevel(message.guild.id, message.author.id);
  const levelSettings = await getLevelSettings(message.guild.id);
  const xpToGive = calculateMultiplierXp(levelSettings, message);
  if (xpToGive === 0) return;
  let newLevel = 0;
  let newXp = 0;
  try {
    //const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id });
    //if (!chatChannelId || chatChannelId.chattingChannel && message.channel.id !== chatChannelId.chattingChannel) return;
    const channel = client.channels.cache.get(await getAnnounceChannel(message.guild.id)) || message.channel;
    if (user) {
      const userLevelXp = calculateLevelXp(user.level)
      newXp = user.xp + xpToGive;
      if (newXp > userLevelXp) {
        newLevel = user.level + 1
        const nickname = message.member.nickname || message.author.globalName;
        const userInfo = {
          level: newLevel,
          xp: newXp,
          color: user.color
        }
        //let embed = await createAnnounceEmbed(message, userInfo);
        const embed = new EmbedBuilder()
          .setColor(0x57F287)
          .setTitle(`${nickname} leveled up!`)
          .setThumbnail(message.author.avatarURL())
          .setDescription(`Congrats you leveled up to level ${newLevel}`)
          .setFooter({
            text: message.guild.name,
            iconURL: message.guild.iconURL()
          })
          .setTimestamp()
        await channel.send({ embeds: [ embed ]});
      } else {
        newLevel = user.level
      }
      cooldowns.add(message.guild.id + message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.guild.id + message.author.id);
      }, 15000);
    } else {
      newLevel = 0;
      newXp = xpToGive;
      cooldowns.add(message.guild.id + message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.guild.id + message.author.id);
      }, 15000);
    }
    await setUserLevelInfo(user, { guildId: message.guild.id, memberId: message.author.id }, { level: newLevel, xp: newXp })

  } catch (error) {
    console.log(`Error giving xp:`, error);
  }
}