const { Client, Guild, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');
const convertNumberInTime = require('../../utils/convertNumberInTime');
const setEventTimeOut = require('../../handlers/setEventTimeOut');
const getNsfwLevelName = require('../../utils/logging/getNsfwLevelName');
const getPreferredLocaleName = require('../../utils/logging/getPreferredLocaleName');

module.exports = async (client, oldGuild, newGuild) => {
  const guildId = oldGuild.id
  try {
    const logChannel = await getLogChannel(client, guildId, 'server');
    if (!logChannel) return;

    const configLogging = checkLogTypeConfig({ guildId: guildId, type: 'server', option: 'updates' });
    if (!configLogging) return;

    let action, title, description, image, thumbnail;
    let fields = [];

    const oldIcon = oldGuild.iconURL();
    const newIcon = newGuild.iconURL();

    const oldName = oldGuild.name;
    const newName = newGuild.name;

    const oldBanner = oldGuild.bannerURL();
    const newBanner = newGuild.bannerURL();

    const oldAfkChannel = oldGuild.afkChannel;
    const newAfkChannel = newGuild.afkChannel;

    const oldAfkTimeout = convertNumberInTime(oldGuild.afkTimeout, 'Seconds');
    const newAfkTimeout = convertNumberInTime(newGuild.afkTimeout, 'Seconds');

    if (oldIcon !== newIcon) {
      image = newIcon;
      action = !oldIcon ? 'added' : (!newIcon ? 'removed' : 'changed');
      title = 'Server Icon Updated';
      description = `Icon ${action}`;
    }

    if (oldName !== newName) {
      title = !title ? 'Server Name Updated' : 'Server Updated';
      fields.push({ name: 'Name Before:', value: oldName});
      fields.push({ name: 'Name After:', value: newName});
    }

    if (oldBanner !== newBanner) {
      title = !title ? 'Server Banner Updated' : 'Server Updated';
      if (image) {
        thumbnail = image;
      }
      image = newBanner;
    }

    if (oldAfkChannel.id !== newAfkChannel.id) {
      title = !title ? 'Server AFK Channel Updated' : 'Server Updated';
      fields.push({ name: 'AFK Channel Before:', value: `${oldAfkChannel}`});
      fields.push({ name: 'AFK Channel after:', value: `${newAfkChannel}`});
    }

    if (oldAfkTimeout !== newAfkTimeout) {
      title = !title ? `Server AFK Timeout ${oldAfkTimeout > newAfkTimeout ? 'Decreased' : 'Increased'}` : 'Server Updated';
      fields.push({ name: 'AFK Timeout Before:', value: oldAfkTimeout});
      fields.push({ name: 'AFK Timeout After:', value: newAfkTimeout});
    }
    
    const oldOwnerId = oldGuild.fetchOwner();
    const newOwnerId = newGuild.fetchOwner();

    if (oldOwnerId !== newOwnerId) {
      title = 'Server Owner Changed';
      fields.push({ name: 'Old Owner:', value: `<@${oldOwnerId}>`});
      fields.push({ name: 'New Owner:', value: `<@${newOwnerId}>`});
    }

    const oldNsfwLevel = getNsfwLevelName(oldGuild.nsfwLevel);
    const newNsfwLevel = getNsfwLevelName(newGuild.nsfwLevel);

    if (oldNsfwLevel !== newNsfwLevel) {
      title = 'Server NSFW Level Updated';
      fields.push({ name: 'Old NSFW Level:', value: oldNsfwLevel});
      fields.push({ name: 'New NSFW Level:', value: newNsfwLevel});
    }

    const oldRulesChannel = oldGuild.rulesChannel;
    const newRulesChannel = newGuild.rulesChannel;

    const oldPublicChannel = oldGuild.publicUpdatesChannel;
    const newPublicChannel = newGuild.publicUpdatesChannel;

    const oldSafetyChannel = oldGuild.safetyAlertsChannel;
    const newSafetyChannel = newGuild.safetyAlertsChannel;

    const oldLocal = getPreferredLocaleName(oldGuild.preferredLocale);
    const newLocal = getPreferredLocaleName(newGuild.perferredLocale);
     
    const oldDescr = oldGuild.description;
    const newDescr = newGuild.description;

    if (oldRulesChannel !== newRulesChannel) {
      title = `Server Rule Channel ${oldRulesChannel ? 'Updated' : 'Set'}`;
      fields.push({ name: 'Rule Channel Before:', value: `${oldRulesChannel}`});
      fields.push({ name: 'Rules Channel After:', value: `${newRulesChannel}`});
    }
  
    if (oldPublicChannel !== newPublicChannel) {
      title = !title ? `Community Updates Channel ${oldPublicChannel ? 'Updated' : 'Set'}` : 'Server Updated';
      fields.push({ name: 'Community Channel Before:', value: `${oldPublicChannel}`});
      fields.push({ name: 'Community Channel After:', value: `${newPublicChannel}`});
    }

    if (oldSafetyChannel !== newSafetyChannel) {
      title = !title ? `Safety Notifications Channel ${oldSafetyChannel ? 'Updated' : 'Set'}` : 'Server Updated';
      fields.push({ name: 'Safety Notification Channel Before:', value: `${oldSafetyChannel}`});µ
      fields.push({ name: 'Safety Notification Channel After:', value: `${newSafetyChannel}`})
    }

    if (oldLocal !== newLocal) {
      title = !title ? `Preferred Local Language Changed` : 'Server Updated';
      fields.push({ name: 'Preferred Langauge Before:', value: oldLocal});
      fields.push({ name: 'Preferred Language After:', value: newLocal});
    }

    if (oldDescr !== newDescr) {
      title = !title ? `Server Description ${oldDescr ? 'Updated' : 'Set'}` : 'Server Updated';
      fields.push({ name: 'Description Before:', value: oldDescr});
      fields.push({ name: 'Description After:', value: newDescr});
    }
    
    const oldWidgetChannel = oldGuild.widgetChannel;
    const newWidgetChannel = newGuild.widgetChannel;

    const oldUseWidget = oldGuild.widgetEnabled;
    const newUseWidget = newGuild.widgetEnabled;

    if (!title) return;

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle(title)
      .setTimestamp()
      .setFooter({ text: `Server ID: ${guildId}` });

    fields.forEach(field => {
      embed.addFields(field);
    });
    if (description) embed.setDescription(description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);

    await setEventTimeOut('server', guildId, embed, logChannel);

  } catch (error) {
    console.error('Failed to log Server Update!', error);
  }
}