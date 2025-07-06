import { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import firstLetterToUpperCase from '../utils/firstLetterToUpperCase.js';
import flattenObject from '../utils/flattenObject.js';
import { findJsonFile } from '../managers/jsonDataManager.js';

const loggingTypes = findJsonFile('loggingTypes.json', 'data');

export default (type) => {
  let logObject = loggingTypes[type];

  if (!logObject) throw new Error(`No logging configuration found for type: ${type}`);

  logObject = flattenObject(logObject);

  const menu = new StringSelectMenuBuilder()
    .setCustomId(`${firstLetterToUpperCase(type)} Logging Menu`)
    .setPlaceholder(`Select Log Events for ${firstLetterToUpperCase(type)} Logs`)
    .setMinValues(1)
    .setMaxValues(Object.keys(logObject).length);

  for (const key in logObject) {
    const option = logObject[key];
    if (option && typeof option === 'object' && option.name && option.description) {
      const value = option.value !== undefined ? option.value : key;
      menu.addOptions({
        label: option.name,
        value: String(value),
        description: option.description,
      });
    }
  }

  const menuRow = new ActionRowBuilder().addComponents(menu);

  const confirmButton = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('Confirm')
    .setStyle(ButtonStyle.Primary);

  const cancelButton = new ButtonBuilder()
    .setCustomId('cancel')
    .setLabel('Cancel')
    .setStyle(ButtonStyle.Secondary);

  const buttonRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

  return [menuRow, buttonRow]; // Return an array with both rows
};