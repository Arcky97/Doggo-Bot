const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = async (interaction, pages, time = 30 * 1000) => {
  try {
    if (!interaction || !pages || pages.length === 0) throw new Error('[PAGINATION] Invalid args');

    await interaction.deferReply();

    if (pages.length === 1) {
      return await interaction.editReply({ embeds: pages, components: [], fetchReply: true });
    }

    let index = 0;

    // Function to update buttons based on the index
    const updateButtons = () => {
      const first = new ButtonBuilder()
        .setCustomId('pagefirst')
        .setLabel('First')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === 0); // Disable if on the first page

      const prev = new ButtonBuilder()
        .setCustomId('pageprev')
        .setLabel('Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === 0 || index === 1); // Disable if on the first or second page

      const pageCount = new ButtonBuilder()
        .setCustomId('pagecount')
        .setLabel(`${index + 1}/${pages.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

      const next = new ButtonBuilder()
        .setCustomId('pagenext')
        .setLabel('Next')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === pages.length - 1 || index === pages.length - 2); // Disable if on the last or second last page

      const last = new ButtonBuilder()
        .setCustomId('pagelast')
        .setLabel('Last')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === pages.length - 1); // Disable if on the last page

      return new ActionRowBuilder().addComponents(first, prev, pageCount, next, last);
    };

    const buttons = updateButtons();

    const msg = await interaction.editReply({ embeds: [pages[index]], components: [buttons], fetchReply: true });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: `Only **${interaction.user.username}** can use these buttons!`, ephemeral: true });
      }

      await i.deferUpdate();

      switch (i.customId) {
        case 'pagefirst':
          index = 0;
          break;
        case 'pageprev':
          if (index > 0) index--;
          break;
        case 'pagenext':
          if (index < pages.length - 1) index++;
          break;
        case 'pagelast':
          index = pages.length - 1;
          break;
      }

      const updatedButtons = updateButtons();

      await msg.edit({ embeds: [pages[index]], components: [updatedButtons] }).catch(console.error);
      collector.resetTimer();
    });

    collector.on('end', async () => {
      await msg.edit({ embeds: [pages[index]], components: [] }).catch(console.error);
    });

    return msg;
  } catch (error) {
    console.error('There was an error with the buttons:', error);
  }
};
