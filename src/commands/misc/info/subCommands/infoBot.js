import { EmbedBuilder } from "@discordjs/builders";
import { botStartTime } from "../../../../index.js";
import { createSuccessEmbed, createErrorEmbed, createInfoEmbed, createUnfinishedEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import formatTime from "../../../../utils/formatTime.js";
import { getBotStats } from "../../../../managers/botStatsManager.js";

export default async (interaction, subCmd, guildId) => {
  let embed;
  try {
    const upTime = await formatTime(botStartTime, true);
    switch(subCmd) {
      case "uptime":
        embed = createSuccessEmbed({ 
          int: interaction, 
          title: 'Doggo Bot Up Time', 
          descr: `Doggo Bot has been online for ${upTime}.`
        });
        break;
      case "show":
        const botMember = interaction.guild.members.cache.get(client.user.id);
        const botAge = await formatTime(client.user.createdAt, true);
        const botJoin = await formatTime(botMember.joinedAt, true);
        embed = new EmbedBuilder()
          .setColor(5763719)
          .setTitle('Doggo Bot Information')
          .setThumbnail(client.user.avatarURL())
          .addFields(
            {
              name: 'Name',
              value: '```Doggo Bot```',
              inline: true 
            }, 
            {
              name: 'Version',
              value: '```1.0.0```',
              inline: true
            }, 
            {
              name: 'Developer',
              value: '```Arcky1997```',
              inline: true 
            },
            {
              name: 'Uptime',
              value: `\`\`\`${upTime}\`\`\``
            },
            {
              name: 'Account Age',
              value: `\`\`\`${botAge}\`\`\``
            },
            {
              name: 'Time in Server',
              value: `\`\`\`${botJoin}\`\`\``
            }
          )
        break;
      case "stats":
        const stats = await getBotStats(guildId);
        embed = new EmbedBuilder()
          .setColor(5763719)
          .setTitle('Doggo Bot Stats')
          .addFields(
            {
              name: 'Total Count',
              value: `\`\`\`${JSON.parse(stats.totalCount)}\`\`\``,
            },
            {
              name: 'Event Count',
              value: `\`\`\`${(Object.entries(JSON.parse(stats.eventCount))).map(([event, value]) =>
                `- ${event}: ${value}`
              ).join(' \n')}\`\`\``,
            },
            {
              name: 'Command Count',
              value: `\`\`\`${(Object.entries(JSON.parse(stats.commandCount))).map(([command, value]) =>
                `- ${command}: ${Object.entries(value).map(([command, value]) => 
                  `\n   - ${command}: ${value}`
                ).join('')}`
              ).join(' \n')}\`\`\``,
            },
            {
              name: 'Level System Count',
              value: `\`\`\`${(Object.entries(JSON.parse(stats.levelSystemCount))).map(([key, value]) => 
                `- ${key}: ${value}`
              ).join(' \n')}\`\`\``,
            }
          )
        //embed = createUnfinishedEmbed(interaction);
        break;
    }
  } catch (error) {
    console.error(error);
    embed = createErrorEmbed({ int: interaction, descr: `Something went wrong with the \`/info ${subCmd}\` command. Please try again later.`});
  }
  return embed;
}