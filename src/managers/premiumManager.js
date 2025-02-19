const { selectData } = require("../services/database/selectData");
const { insertData } = require("../services/database/insertData");
const { deleteData } = require("../services/database/deleteData");
const exportToJson = require("../services/database/exportDataToJson");

async function getPremiumById(id) {
  return await selectData('PremiumUsersAndGuilds', { id: id });
}

async function setPremium(id, type) {
  const premiumDate = new Date();
  const localDate = new Date(premiumDate.getTime() - premiumDate.getTimezoneOffset() * 60000);
  
  await insertData('PremiumUsersAndGuilds', { id: id }, { type: type, date: localDate });
  await exportToJson('PremiumUsersAndGuilds');
}

async function removePremium(id) {
  await deleteData('PremiumUsersAndGuilds', { id: id });
  await exportToJson('PremiumUsersAndGuilds');
}

module.exports = { getPremiumById, setPremium, removePremium };