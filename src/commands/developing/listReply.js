const { EmbedBuilder } = require("discord.js");
const { getReplies } = require("../../../database/triggerResponses/setTriggerResponses");
const pagination = require("../../handlers/pagination");

module.exports = {
  name: 'listreply',
  description: 'Get a list of all Trigger-Resonses with their id',
  devOnly: true,
  callback: async (client, interaction) => {
    replies = await getReplies();
    const embeds = [];
    const pageSize = 8;

    for (var i = 0; i < Math.ceil(replies.length / pageSize); i++) {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle('List with Replies')
        .setTimestamp()
        .setFooter({
          text: `${1 + (i * pageSize)} - ${Math.min((i + 1) * pageSize, replies.length)} of ${replies.length} Replies`
        });

      let description = '';

      for (let j = i * pageSize; j < (i * pageSize) + pageSize && j < replies.length; j++) {
        description += `**ID:** ${replies[j][0]}\n` +
        `**Trigger:** ${replies[j][1]}\n` +
        `${Array.isArray(replies[j][2]) ? 
          `**Response:** ${replies[j][2].join('\n')}\n\n`: 
          `**Response:** ${replies[j][2]}\n\n`}`;
      }

      embed.setDescription(description);
      embeds.push(embed);
    }
    await pagination(interaction, embeds);
  }
}