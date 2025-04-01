const exportDataToJson = require("../services/database/exportDataToJson");
const { insertData } = require("../services/database/insertData");
const { selectData } = require("../services/database/selectData");

async function getDoggoBoardSettings(id) {
  try {
    let data = await selectData('DoggoBoardSettings', { guildId: id } );
    if (!data) {
      await insertData("DoggoBoardSettings", { guildId: id });
      data = await selectData('DoggoBoardSettings', { guildId: id });
      exportDataToJson('DoggoBoardSettings', id);
    }
    return data;
  } catch (error) {
    console.error('Error fetching DoggoBoardSettings:', error);
    return [];
  }
}

module.exports = {
  getDoggoBoardSettings
};