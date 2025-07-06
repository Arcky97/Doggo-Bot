import { insertData } from "../services/database/insertData.js";
import { selectData } from "../services/database/selectData.js";

export async function getDoggoBoardSettings(id) {
  try {
    let data = await selectData('DoggoBoardSettings', { guildId: id } );
    if (!data) {
      await insertData("DoggoBoardSettings", { guildId: id });
      data = await selectData('DoggoBoardSettings', { guildId: id });
    }
    return data;
  } catch (error) {
    console.error('Error fetching DoggoBoardSettings:', error);
    return [];
  }
}