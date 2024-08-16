const { selectData } = require('../controlData/selectData');
const { insertData } = require('../controlData/insertData');
const { updateData } = require('../controlData/updateData');
const { deleteData } = require('../controlData/deleteData');
const { query } = require('../db');
const { exportToJson } = require('../controlData/visualDatabase/exportToJson');
const Fuse = require('fuse.js');

async function getTriggers() {
  try {
    const [rows] = await query('SELECT triggers FROM BotReplies');
    return rows.map(row => row.triggers);
  } catch (error) {
    console.error('Error fetching triggers:', error);
    return [];
  }
}

async function getReplies() {
  try {
    const [rows] = await query('SELECT * FROM BotReplies');
    return rows.map(row => [row.id, row.triggers, row.responses]);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return [];
  }
}

async function getIDs() {
  try {
    const [rows] = await query('SELECT id FROM BotReplies');
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

async function setBotReplies({ trigger, response, action, id }) {
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
      try {
        const triggers = await getTriggers();
        if (!triggers.includes(trigger)) {
          //let responseArray = JSON.parse(data.responses);
          //let responseString = responseArray.join(', ')
          //message = `reply: "${data.triggers}: ${responseString}" successfully added!`
          console.log("we insert the date since it doesn't exist in the database!")
          await insertData('BotReplies', key, data);
          message = {...key, ...data};
        } else {
          console.log('Data with the same trigger already exists in the database!')
          message = `A trigger "${trigger}" already exists!`;
        }        
      } catch (error) {
        console.error("Error inserting data:", error);
        return `Oh no! Something went wrong while adding your new reply. Please try again.`
      }
    } else if (action === "check") {
      try {
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
      } catch (error) {
        console.error("Error checking for similar replies:", error);
        return `Oh no! Something went wrong when checking for similar replies to "${trigger}". Please try again.`
      }
    } else {
      try {
        const dataExist = await selectData('BotReplies', key);
        if (!dataExist) {
          message = `No reply was found with ID: "${id}", check if you gave the correct ID and try again.`
        } else {
          if (action === "update") {
            try {
              await updateData('BotReplies', key, data);
              const dataChange = await selectData('BotReplies', key);
              message = `The trigger-response has been updated from ${dataExist.triggers}-${JSON.parse(dataExist.responses).join(', ')} to ${dataChange.triggers}-${JSON.parse(dataChange.responses).join(', ')}`
            } catch (error) {
              console.error("Error updating data:", error);
              return `Oh no! Something went wrong when updating the reply with ID:${key.id}. Please try again.`
            }
          } else {
            try {
              await deleteData('BotReplies', key);
              message = `The trigger-response was successfully deleted`;
            } catch (error) {
              console.error("Error deleting data:", error);
              return `Oh no! Something went wrong when deleting the reply with ID:${key.id}. Please try again.`
            }
          }
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
        return `Oh no! Something went wrong when retrieving the reply with ID:${key.id} from the database. Please try again.`
      }
    }
    exportToJson('BotReplies');
    return message;
  } catch (error) {
    console.error(`Error when trying to ${action} Reply:`, error);
    return `There was an error when trying to ${action} the given data. Please try again later.`;
  }
}

module.exports = { setBotReplies, findClosestMatch, getTriggers, getReplies };