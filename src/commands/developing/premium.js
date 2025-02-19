const { ApplicationCommandOptionType } = require("discord.js");
const { getPremiumById, setPremium, removePremium } = require("../../managers/premiumManager");
const { createInfoEmbed, createSuccessEmbed, createErrorEmbed, createWarningEmbed } = require("../../services/embeds/createReplyEmbed");
const { setBotStats } = require("../../managers/botStatsManager");

module.exports = {
  name: 'premium',
  description: 'Manage Premium Membership of Users.',
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'add',
      description: 'Give a User or Server Premium Membership.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'type',
          description: 'The Type of Premium Membership',
          choices: [
            {
              name: 'user-based',
              value: 'User-Based'
            },
            {
              name: 'server-based',
              value: 'Server-Based'
            }
          ],
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: 'id',
          description: 'The Server or User ID.',
          required: true 
        }
      ]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'remove',
      description: 'Remove a User or Server Membership.',
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: 'id',
          description: 'The Server or User ID.',
          required: true 
        }
      ]
    }
  ],
  devOnly: true,
  callback: async (interaction) => {
    const guildId = interaction.guild.id;
    const subCmd = interaction.options.getSubcommand();
    let embed;
    await interaction.deferReply();
    const id = interaction.options.getString('id');
    const hasPremium = await getPremiumById(id);
    let userOrGuild;
    if (client.guilds.cache.find(guild => guild.id === id)) userOrGuild = 'Server';
    if (client.users.cache.find(user => user.id === id)) userOrGuild = 'User';
    if (userOrGuild === null) return; // id is not a user or guild.

    try {
      if (interaction.user.id !== '763287145615982592') {
        switch (subCmd) {
          case 'add':
            const type = interaction.options.getString('type');
            if (userOrGuild === 'User' && type === 'Server-Based' || userOrGuild === 'Server' && type === 'User-Based') {
              embed = createInfoEmbed({
                int: interaction,
                title: 'Wrong Premium Type',
                descr: `The given ${userOrGuild} ID: ${id} is not a valid ${type} Type.`
              })
            } else {
              if (!hasPremium) {
                embed = createSuccessEmbed({
                  int: interaction,
                  title: 'Premium Added',
                  descr: `Premium Membership has been Asigned for ${userOrGuild} with ID: ${id}`
                });
                await setPremium(id, type);
              } else {
                embed = createInfoEmbed({
                  int: interaction, 
                  title: 'Premium Already Added',
                  descr: `There's already a Premium Membership for ${userOrGuild} with ID: ${id}`
                })
              }
            }
            break;
          case 'remove':
            if (hasPremium) {
              embed = createSuccessEmbed({
                int: interaction,
                title: 'Premium Removed',
                descr: `Premium Membership has been Removed for ${userOrGuild} with ID: ${id}`
              });
              await removePremium(id);
            } else {
              embed = createInfoEmbed({
                int: interaction, 
                title: 'Premium Not Found',
                descr: `There's no Premium Membership for ${userOrGuild} with ID: ${id}. \nIt's either already removed or didn't exist yet.`
              });
            }
        }
      } else {
        embed = createWarningEmbed({
          int: interaction,
          title: 'Bad Zeta!',
          descr: `No ${interaction.user}! Don't use this command!`
        });
      }
      await setBotStats(guildId, 'command', { category: 'developing', command: 'premium' });
    } catch (error) {
      console.error(`Error when trying to ${subCmd} Membership for ${userOrGuild} with ID: ${id}:`, error);
      embed = createErrorEmbed({
        int: interaction,
        title: `Error ${subCmd === 'add' ? 'Giving' : 'Removing'} Premium`,
        descr: `There went something wrong while trying to ${subCmd === 'add' ? 'Give' : 'Remove'} Premium Membership ${subCmd === 'add' ? 'to' : 'from'} ${userOrGuild} with ID: ${id}.` +
               `Please try again later.`
      });
    }
    interaction.editReply({ embeds: [embed] });
  }
};