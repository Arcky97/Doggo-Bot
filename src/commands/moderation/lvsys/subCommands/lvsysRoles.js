import { getLevelRoles } from "../../../../managers/levelSettingsManager.js";
import { createSuccessEmbed, createInfoEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import { setLevelRolesArray } from "../../../../utils/setArrayValues.js";

export default async (interaction, guildId, subCmd, value, levSettings) => {
  let setting, embed, action, setData;
  const data = await getLevelRoles(guildId) || [];
  const level = interaction.options.getInteger('level');
  switch(subCmd) {
    case 'replace':
      const currentValue = levSettings.roleReplace === 1;
      if (currentValue !== value) {
        setting = { 'roleReplace': value };
        embed = createSuccessEmbed({
          int: interaction,
          title: 'Replace Roles Setting',
          descr: `The Role Replace Setting has been ${value ? '\`enabled\`. \nRoles will be replaced upon gaining.': '\`disabled\`. \nRoles will not be replaced upon gaining.'}`
        });
      } else {
        embed = createInfoEmbed({ 
          int: interaction,
          descr: `The Replace Roles Setting is already ${value ? '\`enabled\`': '\`disabled\`' }.`
        });
      }
      break;
    case 'add':
      const role = interaction.options.getRole('role');
      const match = data.find(dat => (dat.level !== level || dat.level === level ) && dat.roleId === role.id);
      if (match) {
        embed = createInfoEmbed({
          int: interaction,
          title: 'Reward Role already added!',
          descr: `${role} has already been asigned a reward for lv. ${match.level}`
        });
      } else {
        [action, setData] = setLevelRolesArray(subCmd, data, level, role.id);
        setting = { 'levelRoles': setData };
        embed = createSuccessEmbed({
          int: interaction,
          title: `Rreward Role ${action === 'set' ? 'Added' : action}!`,
          descr: `The Reward Role for lv. ${level} has been ${action} to ${role}.`
        });
      }
      break;
    case 'remove':
      [action, setData] = setLevelRolesArray(subCmd, data, level);
      setting = { 'levelRoles': setData };
      embed = createSuccessEmbed({
        int: interaction, 
        title: `Reward role ${action}!`,
        descr: `The Reward Role for lv. ${level} has been ${action}.`
      });
      break;
  }
  return { setting, embed };
}