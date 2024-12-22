const { EmbedBuilder } = require("discord.js");
const setEventTimeOut = require("../handlers/setEventTimeOut");

async function sendModerationLogEvent (guild, channel, color, title, fields) {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setFooter({
      text: guild.name,
      iconURL: guild.iconURL()
    })
    .setTimestamp()
  
  fields.forEach(field => {
    embed.addFields(field);
  });

  await setEventTimeOut('moderation', guild.id, embed, channel);
}

module.exports = {
  createWarningAddLogEmbed: (guild, channel, title, fields) => sendModerationLogEvent(guild, channel, 'Red', title, fields)
}