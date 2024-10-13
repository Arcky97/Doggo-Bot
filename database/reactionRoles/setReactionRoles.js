const { deleteData } = require("../controlData/deleteData");
const { insertData } = require("../controlData/insertData");
const { selectData } = require("../controlData/selectData");
const { updateData } = require("../controlData/updateData");

function reactionRolesKeys(guild, channel, message) {
  return {
    guildId: guild,
    channelId: channel,
    messageId: message
  }
}

function stringifyReactionRoles(input) {
  return {
    emojiRolePairs: JSON.stringify(input)
  }
}

async function getReactionRoles(guild, channel, message) {
  const keys = reactionRolesKeys(guild, channel, message);

  return await selectData('ReactionRoles', keys);
}

async function insertReactionRoles(guild, channel, message, input) {
  const keys = reactionRolesKeys(guild, channel, message);

  const data = stringifyReactionRoles(input);

  await insertData('ReactionRoles', keys, data);
}

async function updateReactionRoles(guild, channel, message, input) {
  const keys = reactionRolesKeys(guild, channel, message);

  const data = stringifyReactionRoles(input);

  await updateData('ReactionRoles', keys, data);
}

async function removeReactionRoles(guild, channel, message) {
  const keys = reactionRolesKeys(guild, channel, message);

  await deleteData('ReactionRoles', keys);
}

async function setReactionOrRoleLimit(guild, channel, message, limit) {
  const keys = reactionRolesKeys(guild, channel, message);

  const data = limit 

  await updateData('ReactionRoles', keys, data);
}

module.exports = { getReactionRoles, insertReactionRoles, updateReactionRoles, removeReactionRoles, setReactionOrRoleLimit };