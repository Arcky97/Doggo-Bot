const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

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
    try {
      await interaction.deferReply();
      // check if the user is trying to kick the bot itself
      if (member.id === client.user.id) {
        await interaction.editReply('Sorry but I cannot kick myself!');
        return;
      }

      // Check if the user is trying to kick themselves
      if (member.id === interaction.member.id) {
        await interaction.editReply('You cannot kick yourself!');
        return;
      } 

      // Check if the user is trying to kick the Guild Owner
      if (member.id == interaction.guild.ownerId) {
        await interaction.editReply('You cannot kick the Owner of the Server!');
        return; 
      } 

      // check if the member is an Administrator
      if (member.permissions.has(PermissionFlagsBits.Administrator) &&
          interaction.guild.ownerId !== interaction.member.id) {
        await interaction.editReply('You cannot kick an Admin of the Server!')
        return;
      } 
      //await member.kick(reason);
      await interaction.editReply(`You kicked <@${member.id}> from the Server. Reason: ${reason}`)
    } catch (error) {
      console.log('Failed to kick the member:', error);
      await interaction.editReply(`There was an error kicking ${member.username}. This member might not be in the server anymore.`)
    }
  }
}