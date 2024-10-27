const { Client, User, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/getLogChannel');

module.exports = async (client, oldUser, newUser) => {
  try {
    // Loop through all guilds to find where the user exists
    for (const guild of client.guilds.cache.values()) {
      const member = await guild.members.fetch(newUser.id).catch(() => null);
      if (!member) continue; // Skip guilds where the user is not a member

      const channel = await getLogChannel(client, guild.id, 'member');
      if (!channel) continue;

      const oldUserName = oldUser.username;
      const newUserName = newUser.username;
      const oldGlobalName = oldUser.globalName;
      const newGlobalName = newUser.globalName;
      const oldUserIcon = oldUser.avatarURL();
      const newUserIcon = newUser.avatarURL();
      let action, title, thumbnail;
      let fields = [];
      
      if (oldUserIcon !== newUserIcon) {
        thumbnail = newUserIcon;
        if (!oldUserIcon) {
          action = 'added';
        } else if (!newUserIcon) {
          action = 'removed';
          thumbnail = null;
        } else {
          action = 'changed';
        }
        title = `Profile Icon ${action}`;
      } else {
        let oldValue, newValue;
        if (oldUserName !== newUserName) {
          title = 'User Name Changed';
          oldValue = oldUserName;
          newValue = newUserName;
        } else if (oldGlobalName !== newGlobalName) {
          title = 'Profile Name Changed';
          oldValue = oldGlobalName;
          newValue = newGlobalName;
        }
        fields.push({ name: 'Before', value: oldValue });
        fields.push({ name: 'After', value: newValue });
      }
      
      if (!title) continue;

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({
          name: newUser.globalName,
          iconURL: newUser.avatarURL()
        })
        .setTitle(title)
        .setTimestamp()
        .setFooter({
          text: `User ID: ${newUser.id}`
        });

      if (title.includes('Name')) {
        fields.forEach(field => {
          embed.addFields({
            name: field.name,
            value: field.value
          });
        });
      } else {
        embed.setThumbnail(thumbnail);
        embed.setDescription(`${newUser}`);
      }

      await channel.send({ embeds: [embed] });
      console.log(`${oldUser.username} updated their profile in guild ${guild.id}!`);
    }
    console.log(`${newUser} updated their profile.`);
  } catch (error) {
    console.error('Failed to log Member update!', error);
  }
};