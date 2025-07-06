import { deleteData } from "../services/database/deleteData.js";
import { insertData } from "../services/database/insertData.js";
import { selectData } from "../services/database/selectData.js";
import { updateData } from "../services/database/updateData.js";

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

export async function getReactionRoles(guild, channel, message) {
  const keys = reactionRolesKeys(guild, channel, message);

  return await selectData('ReactionRoles', keys);
}

export async function insertReactionRoles(guild, channel, message, input) {
  const keys = reactionRolesKeys(guild, channel, message);

  const data = stringifyReactionRoles(input);

  await insertData('ReactionRoles', keys, data);

}

export async function updateReactionRoles(guild, channel, message, input) {
  const keys = reactionRolesKeys(guild, channel, message);

  const data = stringifyReactionRoles(input);

  await updateData('ReactionRoles', keys, data);
}

export async function removeReactionRoles(guild, channel, message) {
  const keys = reactionRolesKeys(guild, channel, message);

  await deleteData('ReactionRoles', keys);
}

export async function setReactionOrRoleLimit(guild, channel, message, limit) {
  const keys = reactionRolesKeys(guild, channel, message);

  const data = limit 

  await updateData('ReactionRoles', keys, data);
}