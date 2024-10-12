const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");
const { exportToJson } = require("../controlData/visualDatabase/exportToJson");

async function getLevelSettings(id) {
  return await selectData('LevelSettings', { guildId: id} );
}

async function getRoleOrChannelMultipliers({id, type}) {
  const data = await getLevelSettings(id);
  if (type === 'role') {
    return JSON.parse(data.roleMultipliers);
  } else if (type === 'channel') {
    return JSON.parse(data.channelMultipliers);
  };
}

async function setLevelSettings({ id, action, glMult, chanMult, roleMult, lvRol, rolRepl, annChan, annPing, annMes, blRoles, blChan, xpCldn, clrOnLea, voiEn, voiMult, voiCldn}) {
  let settings = await getLevelSettings(id);
  // create default settings on server join.
  if (!settings) {
    await insertData('LevelSettings', { guildId: id });
    settings = {};
  }

  if (action === 'insert') {
    const updates = {};

    if (glMult !== undefined) updates.globalMultiplier = glMult;
    if (chanMult !== undefined) updates.channelMultipliers = chanMult;
    if (roleMult !== undefined) updates.roleMultipliers = roleMult;
    if (lvRol !== undefined) updates.levelRoles = lvRol;
    if (rolRepl !== undefined) updates.roleReplace = rolRepl;
    if (annChan !== undefined) updates.announcementId = annChan;
    if (annPing !== undefined) updates.announcementPing = annPing;
    if (annMes !== undefined) updates.announcementMessage = annMes;
    if (blRoles !== undefined) updates.blackListRoles = blRoles;
    if (blChan !== undefined) updates.blackListChannels = blChannels;
    if (xpCldn !== undefined) updates.xpCooldown = xpCldn;
    if (clrOnLea !== undefined) updates.clearOnLeave = clrOnLea;
    if (voiEn !== undefined) updates.voiceEnable = voiEn;
    if (voiMult !== undefined) updates.voiceMultiplier = voiMult;
    if (voiCldn !== undefined) updates.voiceCooldown = voiCldn;

    if (Object.keys(updates).length > 0) {
      await updateData('LevelSettings', { guildId: id}, updates);
    }
  } else if (action === 'delete') {
    await deleteData('LevelSettings', { guildId: id})
  }
  exportToJson('LevelSettings')
}

module.exports = { setLevelSettings, getLevelSettings, getRoleOrChannelMultipliers };