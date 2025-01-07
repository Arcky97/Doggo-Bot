const { EmbedBuilder } = require("discord.js");
const calculateXpByLevel = require("../../../../utils/levels/calculateXpByLevel");
const { createInfoEmbed } = require("../../../../utils/embeds/createReplyEmbed");

module.exports = async (interaction, guildUsers, xpSettings) => {
  if (guildUsers.length > 0) {
    embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`${interaction.guild.name}'s Leaderboard.`)
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
    let rank = 1;
    let description = '';
    for (const user of guildUsers) {
      description += `\n\n**#${rank}**: <@${user.memberId}>` +
                    `\n   **Lv.** \`${user.level}\`` +
                    `\n   **Xp:** \`${user.xp}/${calculateXpByLevel(user.level + 1, xpSettings)}\`` 
      rank ++;
    }
    embed.setDescription(description);
  } else {
    embed = createInfoEmbed({int: interaction, descr: 'Sorry but no one in this server has a level yet.'});
  }
  return embed;
}