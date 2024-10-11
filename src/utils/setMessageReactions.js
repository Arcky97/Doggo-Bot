module.exports = async (interaction, message, pairs, overwrite = false) => {
  try {
    const existingReactions = message.reactions.cache.map(reaction => reaction.emoji.name || reaction.emoji.id);
    const newReactions = pairs.map(({ emoji }) => emoji.trim());

    if (overwrite) {
      const reactionsToRemove = existingReactions.filter(emoji => !newReactions.includes(emoji));

      await Promise.all(
        reactionsToRemove.map(async (emoji) => {
          const reaction = message.reactions.cache.find(r => r.emoji.name === emoji || r.emoji.id === emoji);
          if (reaction)  {
            await reaction.remove();
          }
        })
      )
    }

    await Promise.all(pairs.map(async ({ emoji }) => {
      await message.react(emoji.trim());
    }));

  } catch (error) {
    await interaction.editReply({ content: `Failed to react with one or more emojis. Please check if they can be used in this Server.`, ephemeral: true });
  }
};