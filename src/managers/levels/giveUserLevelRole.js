import { getLevelRoles, getRoleReplace } from "../../managers/levelSettingsManager.js";
import createMissingPermissionsEmbed from "../../utils/createMissingPermissionsEmbed.js";

export default async (guildId, member, userInfo, message) => {
  const interaction = {channel: message.channel, guild: message.guild };
  try {
    const levelRoles = await getLevelRoles(guildId);
    if (levelRoles.length === 0) return;
    const replaceRoles = await getRoleReplace(guildId) === 1;
    const roleToAdd = levelRoles.find(data => data.level === userInfo.level);
    if (roleToAdd === null || roleToAdd === undefined) return;
    await member.roles.add(roleToAdd.roleId);
    if (replaceRoles) {
      const rolesToRemove = levelRoles.filter(data => data.level < userInfo.level);
      for (const data of rolesToRemove) {
        await member.roles.remove(data.roleId);
      };
    }
  } catch (error) {
    console.error("missing permissions:", error);
    const permEmbed = await createMissingPermissionsEmbed(interaction, member, ["ManageRoles"], interaction.channel);
    await interaction.channel.send({ embeds: [permEmbed] });
  }
}