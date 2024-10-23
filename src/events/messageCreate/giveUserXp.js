const { Client, Message, EmbedBuilder } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData');
const { insertData } = require('../../../database/controlData/insertData');
const { exportToJson } = require('../../../database/controlData/visualDatabase/exportToJson');
const calculateLevelXp = require('../../utils/levels/calculateLevelXp');
const { updateData } = require('../../../database/controlData/updateData');
const cooldowns = new Set();
const { getUserLevel, setUserLevelInfo } = require('../../../database/levelSystem/setLevelSystem')

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot || cooldowns.has(message.guild.id + message.author.id)) return;
  const xpToGive = getRandomXp(15, 25);
  const user = await getUserLevel(message.guild.id, message.author.id);
  let newLevel = 0;
  let newXp = 0;
  try {
    const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id });
    if (!chatChannelId || chatChannelId.chattingChannel && message.channel.id !== chatChannelId.chattingChannel) return;
    if (user) {
      const userLevelXp = calculateLevelXp(user.level)
      newXp = user.xp + xpToGive;
      if (newXp > userLevelXp) {
        newLevel = user.level + 1
        const nickname = message.member.nickname || message.author.globalName; 
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
        await message.channel.send({ embeds: [ embed ]});
        //await message.channel.send(`Hooray! ${nickname} leveled up to level ${newLevel}!`);
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