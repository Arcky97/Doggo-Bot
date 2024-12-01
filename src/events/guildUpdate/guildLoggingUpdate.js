const { Client, Guild, EmbedBuilder } = require('discord.js');
const getLogChannel = require('../../utils/logging/getLogChannel');
const checkLogTypeConfig = require('../../utils/logging/checkLogTypeConfig');
const convertNumberInTime = require('../../utils/convertNumberInTime');
const setEventTimeOut = require('../../handlers/setEventTimeOut');

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
      title = 'Server Update';
      description = `Icon ${action}`;
    }

    if (oldName !== newName) {
      title = 'Server Update';
      fields.push({ name: 'Name Before:', value: oldName});
      fields.push({ name: 'Name After:', value: newName});
    }

    if (oldBanner !== newBanner) {
      title = 'Server Update';
      if (image) {
        thumbnail = image;
      }
      image = newBanner;
    }

    if (oldAfkChannel.id !== newAfkChannel.id) {
      title = 'Server Update';
      fields.push({ name: 'AFK Channel Before:', value: `${oldAfkChannel}`});
      fields.push({ name: 'AFK Channel after:', value: `${newAfkChannel}`});
    }

    if (oldAfkTimeout !== newAfkTimeout) {
      title = 'Server Update';
      fields.push({ name: 'AFK Timeout Before:', value: oldAfkTimeout});
      fields.push({ name: 'AFK Timeout After:', value: newAfkTimeout});
    }
    
    const oldDescr = oldGuild.description;
    const newDescr = newGuild.description;

    const oldFeatures = oldGuild.features;
    const newFeatures = newGuild.features;

    const oldNsfwLevel = oldGuild.nsfwLevel;
    const newNsfwLevel = newGuild.nsfwLevel;

    const oldOwnerId = oldGuild.fetchOwner();
    const newOwnerId = newGuild.fetchOwner();

    const oldLocal = oldGuild.preferredLocale;
    const newLocal = newGuild.perferredLocale;
     
    const oldBoosts = oldGuild.premiumSubscriptionCount;
    const newBoosts = newGuild.premiumSubscriptionCount;

    const oldPublicChannel = oldGuild.publicUpdatesChannel;
    const newPublicChannel = newGuild.publicUpdatesChannel;

    const oldRulesChannel = oldGuild.rulesChannel;
    const newRulesChannel = newGuild.rulesChannel;

    const oldSafetyChannel = oldGuild.safetyAlertsChannel;
    const newSafetyChannel = newGuild.safetyAlertsChannel;

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