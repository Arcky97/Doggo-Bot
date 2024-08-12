
const { selectData } = require('../controlData/selectData');
const { query } = require('../db');
const { insertData } = require('../controlData/insertData');
const { deleteData } = require('../controlData/deleteData');
const { updateData } = require('../controlData/updateData');
const { exportToJson } = require('../controlData/visualDatabase/exportToJson');
const Fuse = require('fuse.js');

async function getTriggers() {
  try {
    const [rows] = await query('SELECT triggers FROM TriggerResponses');
    return rows.map(row => row.triggers);
  } catch (error) {
    console.error('Error fetching triggers:', error);
    return [];
  }
}

async function getReplies() {
  try {
    const [rows] = await query('SELECT * FROM TriggerResponses');
    return rows.map(row => [row.id, row.triggers, row.responses]);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return [];
  }
}

async function getIDs() {
  try {
    const [rows] = await query('SELECT id FROM TriggerResponses');
    return rows.map(row => [row.id]);
  } catch (error) {
    console.error('Error fetching IDs:', error);
    return [];
  }
}

async function findClosestMatch(target, array) {
  if (array.length < 1) return;
  let closestMatches;
  const options = {
    includeScore: true,
    threshold: 0.7, // Adjust threshold for more or less fuzziness
    distance: 50,
    keys: ['str'], // Specify the keys to search in objects
    limit: array.length
  };
  const fuse = new Fuse(array.map(str => ({ str })), options);
  const result = fuse.search(target);
  let color;
  if (result.length > 0) {
    if (result[0].score >= 0.5) {
      color = 0xED4245
    } else if (result[0].score >= 0.25) {
      color = 0xE67E22
    } else {
      color = 0x57F287
    }
  }
  
  // Get the closest matches
  closestMatches = result.map(match => match.item.str);
  return { matches: closestMatches.slice(0, 5), color: color };
}

async function setTriggerResponses({ trigger, response, action, id }) {
  const { customAlphabet } = await import('nanoid');
  const numbers = '0123456789';

  const generateNumericId = customAlphabet(numbers, 11);
  let key; 
  let data;
  let existIDs = await getIDs()

  if (action === "insert") {
    let numberId = generateNumericId();
    while (existIDs.includes(numberId)) {
      console.log(`Generating a new id since ${numberId} is already in use!`);
      numberId = generateNumericId();
    }
    response = JSON.stringify(response);
    console.log(response);

    key = {
      id: numberId
    }

    data = {
      triggers: trigger,
      responses: response
    }
  } else { // update or delete
    key = {
      id: id 
    }

    data = {
      triggers: trigger
    }
  }

  let message;
  try {
    if (action === "insert") {
      console.log("we insert the date since it doesn't exist in the database!")
      await insertData('TriggerResponses', key, data);

      let respString = JSON.parse(data.responses);
      let string = respString.join(', ')
      console.log(string);

      message = `reply: "${data.triggers}: ${string}" successfully added!`
    } else if (action === "check") {
      const triggers = await getTriggers();
      const closestMatch = await findClosestMatch(trigger, triggers);
      if (closestMatch.matches !== '') {
        message = closestMatch;
      } else {
        message = {
          matches: '\n none 💀',
          color: 0xED4245
        }
      }
    } else {
      const dataExist = await selectData('TriggerResponses', key);
      if (!dataExist) {
        message = `${key} doesn't seem to exist, check if you gave the correct ID and try again.`
      } else {
        if (action === "update") {
          await updateData('TriggerResponses', key, data);
          const dataChange = await selectData('TriggerResponses', key);
          message = `The trigger-response has been updated from ${dataExist.trigger}-${dataExist.response} to ${dataChange.trigger}-${dataChange.response}`
        } else {
          deleteData('TriggerResponses', key);
          message = `The trigger-response was successfully deleted`;
        }
      }      
    }
    exportToJson('TriggerResponses');
    return message;
  } catch (error) {
    console.error(`Error when trying to ${action} Reply:`, error);
    return `There was an error when trying to ${action} the given data. Please try again later.`;
  }
}

module.exports = { setTriggerResponses, findClosestMatch, getTriggers, getReplies };