const { EmbedBuilder } = require("discord.js");
const { addUserColor } = require("../../../../../database/levelSystem/setLevelSystem");
const getOrConvertColor = require("../../../../utils/getOrConvertColor");
const { createErrorEmbed, createInfoEmbed } = require("../../../../utils/embeds/createReplyEmbed");

module.exports = async (interaction, userLevel) => {
  if (userLevel) {
    const colorChoice = interaction.options.get('color').value;
    let { hexColor, message } = await getOrConvertColor(colorChoice, true);
    if (hexColor) {
      const thumbnailUrl = `https://singlecolorimage.com/get/${hexColor.replace('#','')}/64x64`
      embed = new EmbedBuilder()
        .setColor(hexColor)
        .setTitle('New Rank Card Color')
        .setDescription(message)
        .setThumbnail(thumbnailUrl)
        .setTimestamp()
      try {
        await addUserColor(interaction.guild.id, interaction.member.id, hexColor);
      } catch (error) {
        console.log('Error inserting color.', error);
        embed = createErrorEmbed({int: interaction, descr: 'Something went wrong while setting you color. \nPlease try again later.'});
        if (embed) interaction.editReply({embeds: [embed]});
      }
    } else {
      embed = createErrorEmbed({int: interaction, descr: message});
    }
    interaction.editReply({ embeds: [embed] });
  } else {
    embed = createInfoEmbed({int: interaction, title: 'Info: No level Yet!', descr: 'You don\'t have a level yet so you can\'t set a color just yet.'});
  }
  return embed;
}