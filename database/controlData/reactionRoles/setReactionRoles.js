const { deleteData } = require("../deleteData");
const { insertData } = require("../insertData");
const { selectData } = require("../selectData");
const { updateData } = require("../updateData");

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

module.exports = { getReactionRoles, insertReactionRoles, updateReactionRoles, removeReactionRoles };