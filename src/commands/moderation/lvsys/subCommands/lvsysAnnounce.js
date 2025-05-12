const { EmbedBuilder } = require("discord.js");
const getAnnounceEmbed = require("../../../../managers/levels/getAnnounceEmbed");
const getAnnouncementSettings = require("../../../../managers/levels/getAnnouncementSettings");
const getLevelFromXp = require("../../../../managers/levels/getLevelFromXp");
const { getUserLevel } = require("../../../../managers/levelSystemManager");
const { createSuccessEmbed, createInfoEmbed, createWarningEmbed } = require("../../../../services/embeds/createReplyEmbed");
const createMissingPermissionsEmbed = require("../../../../utils/createMissingPermissionsEmbed");
const getOrConvertColor = require("../../../../utils/getOrConvertColor");
const { setAnnounceLevelArray } = require("../../../../utils/setArrayValues");
const parseEmbedPlaceholders = require("../../../../services/embeds/parseEmbedPlaceholders");
const getChannelTypeName = require("../../../../managers/logging/getChannelTypeName");

module.exports = async (interaction, guildId, subCmd, value, levSettings, xpSettings) => {
  let setting, embed, currentValue, embedOptions, level, action, setData
  switch(subCmd) {
    case 'channel':
      currentValue = levSettings.announceChannel;
      const channel = interaction.options.getChannel('name');
      const missingChanPermEmbed = await createMissingPermissionsEmbed(interaction, interaction.member, [], channel);
      // Channel has required prermissions
      if (!missingChanPermEmbed) {
        // Channel is not current channel set
        if (currentValue !== channel.id) {
          const channelTypeName = getChannelTypeName(channel);
          // Channel is a text channel
          if (channel.type === 0) {
            setting = { 'announceChannel': channel.id };
            embed = createSuccessEmbed({ 
              int: interaction, 
              title: `Level Up Announce Channel ${currentValue ? 'updated' : 'set'}!`,
              descr: `The Level Up Announce Channel has been ${currentValue ? 'updated': 'set'} to ${channel}.`
            });
          // Channel is not a text channel
          } else {
            embed = createWarningEmbed({
              int: interaction,
              title: 'Level Up Announce Channel not set!',
              descr: `${channel} is a ${channelTypeName} and cannot be set as the Level Up Announce Channel.`
            });
          }
        // Channel is same as current channel set
        } else {
          embed = createInfoEmbed({
            int: interaction,
            descr: `The Level Up Announce Channel has already been set to <#${currentValue}>.`
          });
        }
      // Channel does not have required permissions
      } else {
        missingChanPermEmbed.setDescription(`Unable to set ${channel} as the Announcement Channel as following permissions are missing:`);
        embed = missingChanPermEmbed;
      }
      break;
    case 'ping':
      currentValue = levSettings.announcePing === 1;
      // current value is not the same
      if (currentValue !== value) {
        setting = { 'announcePing': value };
        embed = createSuccessEmbed({
          int: interaction,
          title: 'Level Up Announce Ping updated!',
          descr: `The ping has been ${value ? '\`enabled\`' : '\`disabled\`' }.`
        });
      // current value is the same
      } else {
        embed = createInfoEmbed({
          int: interaction,
          descr: `The Level Up Announce Ping is already ${value ? '\`enabled\`' : '\`disabled\`'}.`
        });
      }
      break;
    case 'message':
      const color = interaction.options.getString('color');
      embedOptions = {
        title: interaction.options.getString('title') || '{user global} has leveled up!',
        description: interaction.options.getString('description') || 'Congrats you level up to lv. {level}!',
        color: !color ? '{user color}' : color.startsWith('{') ? color : await getOrConvertColor(color),
        thumbnailUrl: interaction.options.getBoolean('thumbnailurl') ? '{user avatar}' : null,
        imageUrl: interaction.options.getString('imageurl'),
        footer: {
          text: interaction.options.getString('footer') || '{server name}',
          iconUrl: interaction.options.getString('footericonurl') || '{server icon}'
        },
        timeStamp: interaction.options.getBoolean('timestamp')
      };
      level = interaction.options.getInteger('level');
      // level is given, level message
      if (level) {
        [action, setData] = setAnnounceLevelArray(levSettings, { lv: level, options: embedOptions });
        setting = { 'announceLevelMessages': setData };
        embed = createSuccessEmbed({
          int: interaction, 
          title: `Level Up Message ${action}!`,
          descr: `The Level Up Message for lv. ${level} has been ${action}! \nUse \`/lvsys announce show level: ${level}\` to view it.`
        });
      // default message
      } else {
        setting = { 'announceDefaultMessage': JSON.stringify(embedOptions)};
        embed = createSuccessEmbed({
          int: interaction,
          title: 'Level Up Message updated!',
          descr: 'The Default Level Up Message has been updated! \nUse `/lvsys announce show` to view it.'
        });
      }
      break;
    case 'remove':
      level = interaction.options.getInteger('level');
      [action, setData] = setAnnounceLevelArray(levSettings, level);
      setting = { 'announceLevelMessages': setData };
      // a message for given level found
      if (action !== 'not found') {
        embed = createSuccessEmbed({
          int: interaction, 
          title: 'Level Up Message removed!',
          descr: `The Level Up Message for lv. ${level} has been ${action}.`
        });
      // a message for given level not found
      } else {
        embed = createInfoEmbed({
          int: interaction,
          title: 'Level Up Message not found!',
          descr: `The Level Up Message for lv. ${level} does not exist!`
        });
      }
      break;
    case 'settings':
      embed = getAnnouncementSettings(levSettings);
      break;
    case 'show':
      level = interaction.options.getInteger('level');
      // a level is given
      if (level) {
        embedOptions = JSON.parse(levSettings.announceLevelMessages).find(data => data.lv === level)?.options;
      // use default
      } else {
        embedOptions = JSON.parse(levSettings.announceDefaultMessage);
      }
      const userInfo = await getUserLevel(guildId, interaction.user.id);
      const userLevelInfo = {
        "guildId": guildId,
        "memberId": interaction.user.id,
        "level": (level || userInfo.level),
        "xp": getLevelFromXp((level || userInfo.level), xpSettings),
        "color": userInfo.color 
      };
      if (userLevelInfo.level === 0) userLevelInfo.level = 1;
      embed = await getAnnounceEmbed(guildId, interaction, userLevelInfo);
      break;
    case 'placeholders':
      // show all place holders
      const fieldObject = {
        "user": [
          '{user id}** (The user\'s ID)',
          '{user mention}** (Mention the user)',
          '{user name}** (The user\'s name)',
          '{user global}** (The user\'s global name)',
          '{user nick}** (The user\'s nickname)',
          '{user avatar}** (The user\'s avatar url)',
          '{uer color}** (The user\'s rank card color)'
        ],
        "level and xp": [
          '{user xp}** (The user\'s current level XP)',
          '{level}** (The user\'s current level)',
          '{level previous}** (The user\'s previous level)',
          '{level previous xp}** (The user\'s previous level XP)',
          '{level next}** (The user\'s next level)',
          '{level next xp}** (The user\'s next level XP)'
        ],
        "level rewards": [
          '{reward}** (The reward role)',
          '{reward role name}** (The reward role\'s name)',
          '{reward rolecount}** (The total reward count)',
          '{reward rolecount progress}** (The reward progress in {reward rolecount progress} format)',
          '{reward previous}** (The previous reward role)',
          '{reward next}** (The next reward role)'
        ],
        "server": [
          '{server id}** (The server\'s ID)',
          '{server name}** (The server\'s name)',
          '{server member count}** (The total members in the server)',
          '{server icon}** (The Server Icon Url)'
        ],
        "other": [
          '{new line} (Add a new line)**'
        ]
      }
      embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Announce Level Up Message Placeholders')
        .setTimestamp()
      for (const [key, placeholders] of Object.entries(fieldObject)) {
        const values = await Promise.all(
          placeholders.map(async (placeholder) => `\`${placeholder.split('}')[0] + '}'}\` = **${await parseEmbedPlaceholders(placeholder, interaction)}`)
        );
        const valueString = values.join('\n - ').trim();
        embed.addFields(
          {
            name: key,
            value: `- ${valueString}`
          }
        )
      };
      break;
  }
  return { setting, embed };
}