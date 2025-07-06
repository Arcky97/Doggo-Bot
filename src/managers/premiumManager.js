import { selectData } from "../services/database/selectData.js";
import { insertData } from "../services/database/insertData.js";
import { deleteData } from "../services/database/deleteData.js";

export async function getPremiumById(id) {
  return await selectData('PremiumUsersAndGuilds', { id: id });
}

export async function setPremium(id, type) {
  const premiumDate = new Date();
  const localDate = new Date(premiumDate.getTime() - premiumDate.getTimezoneOffset() * 60000);
  
  await insertData('PremiumUsersAndGuilds', { id: id }, { type: type, date: localDate });
}

export async function removePremium(id) {
  await deleteData('PremiumUsersAndGuilds', { id: id });
}