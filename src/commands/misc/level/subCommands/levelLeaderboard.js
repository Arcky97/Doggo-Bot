import { EmbedBuilder } from "discord.js";
import getXpFromLevel from "../../../../managers/levels/getXpFromLevel.js";
import { createInfoEmbed } from "../../../../services/embeds/createReplyEmbed.js";

export default async (interaction, guildUsers, xpSettings) => {
  let embed;
  if (guildUsers.length > 0) {
    embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`${interaction.guild.name}'s Leaderboard.`)
      .setTimestamp()
      .setThumbnail(interaction.guild.iconURL())
    let rank = 1;
    let description = '';
    for (const user of guildUsers) {
      if (rank > 10) break;
      description += `\n\n**#${rank}**: <@${user.memberId}>` +
      `\n   **Lv.** \`${user.level}\`` +
      `\n   **Xp:** \`${user.xp}/${getXpFromLevel(user.level + 1, xpSettings)}\`` 
      rank ++;
    }
    embed.setDescription(description);
  } else {
    embed = createInfoEmbed({int: interaction, descr: 'Sorry but no one in this server has a level yet.'});
  }
  return embed;
}