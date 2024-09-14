module.exports = async (interaction, message, pairs, overwrite = false) => {
  try {
    if (overwrite) {
      await message.reactions.removeAll();
    }

    await Promise.all(pairs.map(async ({ emoji }) => {
      await message.react(emoji.trim());
    }));

  } catch (error) {
    await interaction.editReply({ content: `Failed to react with one or more emojis. Please check if they can be used in this Server.`, ephemeral: true });
  }
};
