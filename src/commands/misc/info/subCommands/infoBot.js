import { EmbedBuilder } from "@discordjs/builders";
import { botStartTime } from "../../../../index.js";
import { createSuccessEmbed, createErrorEmbed } from "../../../../services/embeds/createReplyEmbed.js";
import formatTime from "../../../../utils/formatTime.js";

export default async (interaction, subCmd) => {
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
    }
  } catch (error) {
    console.error(error);
    embed = createErrorEmbed({ int: interaction, descr: `Something went wrong with the \`/info ${subCmd}\` command. Please try again later.`});
  }
  return embed;
}