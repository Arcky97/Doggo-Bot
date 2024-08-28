const { Client, Message } = require('discord.js');
const { selectData } = require('../../../database/controlData/selectData');
const { insertData } = require('../../../database/controlData/insertData');
const { exportToJson } = require('../../../database/controlData/visualDatabase/exportToJson');
const calculateLevelXp = require('../../utils/calculateLevelXp');

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot) return;


  const xpToGive = getRandomXp(5, 15);
  const userXp = await selectData('LevelSystem', { guildId: message.guild.id, memberId: message.author.id })
  let newLevel = 0;
  let newXp = 0;
  try {
    const chatChannelId = await selectData('GuildSettings', {guildId: message.guild.id });
    if (!chatChannelId || chatChannelId['chattingChannel'] && message.channel.id !== chatChannelId['chattingChannel']) return;
    if (userXp) {
      const userLevelXp = calculateLevelXp(userXp['level'])
      console.log(userLevelXp)
      newXp = userXp['xp'] + xpToGive;
      if (newXp > userLevelXp) {
        await message.channel.send(`Hooray! ${message.author.globalName} leveled up to ${userXp['level'] + 1}`);
        newLevel = userXp['level'] + 1
      } else {
        newLevel = userXp['level']
      }
      
    } else {
      newLevel = 0;
      newXp = xpToGive;
    }
    await insertData('LevelSystem', { guildId: message.guild.id, memberId: message.author.id }, { level: newLevel, xp: newXp })
    message.channel.send(`${xpToGive} XP was added for ${message.author.globalName}`)
    exportToJson('LevelSystem');
  } catch (error) {
    console.log(`Error giving xp:`, error);
  }
}