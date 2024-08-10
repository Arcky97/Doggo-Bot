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
    for (var i = 0; i < Math.ceil(replies.length / 5); i++) {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle('List with Replies')
        .setTimestamp();

      let description = '';

      for (let j = i; j < i + 5 && j < replies.length; j++) {
        description += `**ID:** ${replies[j][0]}\n` +
        `**Trigger:** ${replies[j][1]}\n` +
        `**Response(s):** ${replies[j][2]}\n\n`;
      }

      embed.setDescription(description);
      embeds.push(embed);
    }
    await pagination(interaction, embeds);
  }
}