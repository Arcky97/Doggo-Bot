const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const { createInfoEmbed, createWarningEmbed, createSuccessEmbed } = require("../../utils/createReplyEmbed");

module.exports = {
  name: 'kick',
  description: 'Kick a member from the Server!',
  options: [
    {
      name: 'member',
      description: 'The member to kick',
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },
    {
      name: 'reason',
      description: 'The reason for kicking.',
      type: ApplicationCommandOptionType.String
    }
  ],
  permissionsRequired: [
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.Administrator
  ],
  botPermissions: [
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.Administrator
  ],
  callback: async (client, interaction) => {
    const member = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    let embed;
    try {
      await interaction.deferReply();
      // check if the user is trying to kick the bot itself
      if (member.id === client.user.id) {
        embed = createInfoEmbed(interaction, 'Sorry but I cannot kick myself! Don\'t try it again!');
        interaction.editReply({embeds: [embed]});
        return;
      }

      // Check if the user is trying to kick themselves
      if (member.id === interaction.member.id) {
        embed = createWarningEmbed(interaction, 'You cannot kick yourself! Why even would you?');
        interaction.editReply({embeds: [embed]});
        return;
      } 

      // Check if the user is trying to kick the Guild Owner
      if (member.id == interaction.guild.ownerId) {
        embed = createWarningEmbed(interaction, 'You cannot kick the Owner of the Server! Gain more power and try again! (or don\t)');
        interaction.editReply({embeds: [embed]});
        return; 
      } 

      // check if the member is an Administrator
      if (member.permissions.has(PermissionFlagsBits.Administrator) &&
          interaction.guild.ownerId !== interaction.member.id) {
        embed = createWarningEmbed(interaction, 'You cannot kick an Admin of the Server! Just don\'t!');
        interaction.editReply({embeds: [embed]});
        return;
      } 
      //await member.kick(reason);
      embed = createSuccessEmbed(interaction, 'It was a critical kick!', `You kicked ${member} from the Server. \nReason: ${reason}`);
      interaction.editReply({embeds: [embed]});
    } catch (error) {
      console.log('Failed to kick the member:', error);
      embed = createWarningEmbed(interaction, `There was an error kicking ${member.username}. \nThis member might not be in the Server anymore.`);
      await interaction.editReply({embeds: [embed]});
    }
  }
}