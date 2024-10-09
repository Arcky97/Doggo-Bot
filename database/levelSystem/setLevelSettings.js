const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

async function setLevelSettings({ id, action, lvMult, lvRol, annChan, annPing, annMes, roleMult, chanMult, blRoles, blChan, xpCD}) {
  let settings = await selectData('LevelSettings', { guildId: id });
  // create default settings on server join.
  if (!settings) {
    await insertData('LevelSettings', { guildId: id });
    settings = {};
  }

  if (action === 'insert') {
    const updates = {};

    if (lvMult !== undefined) updates.levelMultiplier = lvMult;
    if (lvRol !== undefined) updates.levelRoles = lvRol;
    if (annChan !== undefined) updates.announcementId = annChan;
    if (annPing !== undefined) updates.announcementPing = annPing;
    if (annMes !== undefined) updates.announcementMessage = annMes;
    if (roleMult !== undefined) updates.roleMultipliers = roleMult;
    if (chanMult !== undefined) updates.channelMultipliers = chanMult;
    if (blRoles !== undefined) updates.blackListRoles = blRoles;
    if (blChan !== undefined) updates.blackListChannels = blChannels;
    if (xpCD !== undefined) updates.xpCooldown = xpCD;

    if (Object.keys(updates).length > 0) {
      await updateData('LevelSettings', { guildId: id}, updates);
    }
  } else if (action === 'delete') {
    await deleteData('LevelSettings', { guildId: id})
  }
  exportToJson('LevelSettings')
}

module.exports = { setLevelSettings };