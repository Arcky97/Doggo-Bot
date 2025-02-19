const { createWarningEmbed } = require("../services/embeds/createReplyEmbed");
const { checkClientPermissions, checkUserPermissions } = require("../middleware/permissions/checkPermissions")

module.exports = async (interaction, user, perms, channel) => {

  const chan = channel || interaction.channel;
  const botPerms = await checkClientPermissions(chan, [...perms, 'EmbedLinks']);
  const userPerms = await checkUserPermissions(chan, perms, user);

  let fields = [];
  if (!botPerms.hasAll || !userPerms.hasAll) {
    if (!botPerms.hasAll) {
      fields.push({
        name: 'I need:',
        value: `- ${botPerms.array.join('\n- ')}`
      });
    }
    if (!userPerms.hasAll) {
      fields.push({
        name: 'You need:',
        value: `- ${userPerms.array.join('\n- ')}`
      });
    }
    let embed = createWarningEmbed({
      int: interaction,
      title: 'Missing Permissions',
      descr: `Unable to execute command as following permission${botPerms.array.concat(userPerms.array).length > 1 ? 's are' : ' is'} missing:`
    });
    embed.addFields(fields);
    return embed;
  }
}