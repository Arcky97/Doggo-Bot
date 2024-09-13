const { Client, Message } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData');
const { insertData } = require('../../../database/controlData/insertData');
const { exportToJson } = require('../../../database/controlData/visualDatabase/exportToJson');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const { updateData } = require('../../../database/controlData/updateData');
const cooldowns = new Set();
const { getUserLevel } = require('../../../database/levelSystem/setLevelSystem')

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot || cooldowns.has(message.guild.id + message.author.id)) return;
  const xpToGive = getRandomXp(15, 25);
  const userXp = await getUserLevel(message.guild.id, message.author.id);
  let newLevel = 0;
  let newXp = 0;
  try {
    const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id });
    if (!chatChannelId || chatChannelId['chattingChannel'] && message.channel.id !== chatChannelId['chattingChannel']) return;
    if (userXp) {
      const userLevelXp = calculateLevelXp(userXp['level'])
      newXp = userXp['xp'] + xpToGive;
      if (newXp > userLevelXp) {
        newLevel = userXp['level'] + 1
        const nickname = message.member.nickname || message.author.globalName; 
        await message.channel.send(`Hooray! ${nickname} leveled up to level ${newLevel}!`);
      } else {
        newLevel = userXp['level']
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
    if (userXp) {
      await updateData('LevelSystem', { guildId: message.guild.id, memberId: message.author.id }, { level: newLevel, xp: newXp })
    } else {
      await insertData('LevelSystem', { guildId: message.guild.id, memberId: message.author.id }, { level: newLevel, xp: newXp })
    }
    exportToJson('LevelSystem');
  } catch (error) {
    console.log(`Error giving xp:`, error);
  }
}