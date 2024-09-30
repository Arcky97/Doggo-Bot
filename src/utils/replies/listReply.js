const { EmbedBuilder } = require("discord.js");
const pagination = require("../../handlers/pagination");
const { getReplies } = require("../../../database/botReplies/setBotReplies");

const listReply = async (interaction) => {
  const embeds = [];
  const pageSize = 9;
  try {
    replies = await getReplies();
    if (replies.length > 0) {
      for (var i = 0; i < Math.ceil(replies.length / pageSize); i++) {
        const embed = new EmbedBuilder()
          .setColor('Green')
          .setTitle('List with Replies')
          .setTimestamp()
          .setFooter({
            text: `${1 + (i * pageSize)} - ${Math.min((i + 1) * pageSize, replies.length)} of ${replies.length} Replies`
          });
        let description = '';
        let reply;
        let triggers;
        let responses;
        let resp;
        let trig;
        for (let j = i * pageSize; j < (i * pageSize) + pageSize && j < replies.length; j++) {
          reply = replies[j]
          trig = (reply.triggers.length > 1) ? '**Triggers:**' : '**Trigger:**'
          resp = (reply.responses.length > 1) ? '**Responses:**' : '**Response:**'
          triggers = `\n   - ${reply.triggers.join('\n  - ')}`
          responses = `\n   - ${reply.responses.join('\n  - ')}`
          description += `**ID:** ${reply.id}\n` +
          `- ${trig} ${triggers}\n` +
          `- ${resp} ${responses}\n\n`;
        }
        embed.setDescription(description);
        embeds.push(embed);
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('No Replies found')
        .setDescription('use `/addreply` to start adding replies.')
        .setTimestamp();
      embeds.push(embed);
    }
  } catch (error) {
    console.error('Error collecting replies from database:', error);
  }
  try {
    await pagination(interaction, embeds);
  } catch (error) {
    console.error('Error generating pages for the embed:', error);
  }
};

module.exports = { listReply };