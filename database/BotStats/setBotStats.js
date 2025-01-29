const exportToJson = require("../../src/handlers/exportToJson");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");


async function getBotStats(guildId) {
  try {
    let data = await selectData('BotStats', { guildId: guildId });
    if (!data) {
      await insertData('BotStats', { guildId: guildId });
      data = await selectData('BotStats', { guildId: guildId });
      exportToJson('BotStats', guildId);
    }
    return data; 
  } catch (error) {
    console.error('Error getting Bot Stats:', error);
    return [];
  }
}

async function setBotStats(guildId, type, data) {
  try {
    const stats = await getBotStats(guildId);
    let newData;
    if (`${type}Count` in stats) {
      switch (type) {
        case 'event':
          newData = await addEventCount(JSON.parse(stats.eventCount), data);
          break;
        case 'command':
          newData = await addCommandCount(JSON.parse(stats.commandCount), data);
          break;
        case 'levelSystem':
          newData = await addLevelSystemCount(JSON.parse(stats.levelSystemCount), data);
          break;
      }
      let totalCount = JSON.parse(stats.totalCount);
      totalCount = addToCounter(totalCount, [], 1);
      await updateData('BotStats', { guildId: guildId }, { [`${type}Count`]: newData, totalCount: JSON.stringify(totalCount) });
      await exportToJson('BotStats', guildId);
    } else {
      console.info(`${type} is not a valid counter.`);
    }
  } catch (error) {
    console.error(`Error increasing the ${type}Counter:`, error);
  }
}

async function addEventCount(counter, data) {
  // data = { event: "messageCreate" }
  counter = addToCounter(counter, [data.event], 1);
  return JSON.stringify(counter);
}

async function addCommandCount(counter, data) {
  // data = { category: "developing", command: "reply" };
  counter = addToCounter(counter, [data.category, data.command], 1);
  return JSON.stringify(counter);
}

async function addLevelSystemCount(counter, data) {
  // data = { xp: 11, levels: 1 };
  for (const key in data) {
    counter = addToCounter(counter, [key], data[key]);
  }
  return JSON.stringify(counter);
}

function addToCounter(counter, dataArray, increment) {
  ['current', 'total'].forEach(type => {
    if (type in counter) {
      if (dataArray.length >= 1) {
        let subCounter = counter[type];
        dataArray.forEach((data, index) => {
          if (typeof data === 'string') {
            if (index !== dataArray.length - 1) {
              if (!(data in subCounter)) {
                subCounter[data] = {};
              }
              subCounter = subCounter[data];
            } else {
              if (!(data in subCounter)) {
                subCounter[data] = increment;
              } else {
                subCounter[data] += increment;
              }
            }
          }
        });
      } else {
        counter[type] += increment;
      }
    }
  });
  return counter;
}

module.exports = { getBotStats, setBotStats };