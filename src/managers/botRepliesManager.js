import { selectData } from '../services/database/selectData.js';
import { insertData } from '../services/database/insertData.js';
import { updateData } from '../services/database/updateData.js';
import { deleteData } from '../services/database/deleteData.js';
import { query } from './databaseManager.js';
import Fuse from 'fuse.js';

export async function getTriggers() {
  try {
    const [rows] = await query('SELECT triggers FROM BotReplies');
    return rows.map(row => JSON.parse(row.triggers));
  } catch (error) {
    console.error('Error fetching triggers:', error);
    return [];
  }
}

export async function getReplies() {
  try {
    const [rows] = await query('SELECT * FROM BotReplies');
    return rows.map(row => ({
      id: row.id, 
      triggers: JSON.parse(row.triggers), 
      responses: JSON.parse(row.responses)
    }));
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

export async function findClosestMatch(target, array) {
  if (array.length < 1) return;

  const flattenedArray = array.flat();
  const options = {
    includeScore: true,
    threshold: 0.7, 
    distance: 50,
    keys: ['str'], 
    limit: flattenedArray.length
  };

  const fuse = new Fuse(flattenedArray.map(str => ({ str })), options);

  const result = fuse.search(target);
  let color;

  if (result.length > 0) {
    if (result[0].score >= 0.5) {
      color = 0xED4245; // Red
    } else if (result[0].score >= 0.25) {
      color = 0xE67E22; // Orange
    } else {
      color = 0x57F287; // Green
    }
  }

  const closestMatches = result.map(match => match.item.str);

  return { matches: closestMatches.slice(0, 5), color: color };
}

export async function setBotReplies({ trigger, response, action, id }) {
  const { customAlphabet } = await import('nanoid');
  const numbers = '0123456789';

  const generateNumericId = customAlphabet(numbers, 11);

  let key, data;
  let existIDs = await getIDs()
  trigger = JSON.stringify(trigger);
  response = JSON.stringify(response);
  if (action === 'insert') {
    let numberId = generateNumericId();
    while (existIDs.includes(numberId)) {
      numberId = generateNumericId();
    }

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

    if (trigger) {
      data = {
        triggers: trigger
      }
    } else {
      data = {
        responses: response
      }
    }
  }

  let message;
  try {
    if (action === 'insert') {
      try {
        const triggers = await getTriggers();
        trigger = JSON.parse(trigger);
        if (!trigger.some(t => triggers.some(s => s.includes(t)))) {
          await insertData('BotReplies', key, data);
          message = {...key, ...data};
        } else {

          message = `A trigger "${trigger}" already exists in the database!`;
        }
      } catch (error) {
        console.error('Error inserting data:', error);
        return `Oh no! Something went wrong while adding your new reply. Please try again.`
      }
    } else if (action === 'check') {
      try {
        const triggers = await getTriggers();
        trigger = JSON.parse(trigger);
        const closestMatch = await findClosestMatch(trigger, triggers);
        if (closestMatch.matches.length > 0) {
          message = closestMatch;
        } else {
          message = {
          matches: '\n none 💀',
          color: 0xED4245
        }
      }
      } catch (error) {
        console.error('Error checking for similar replies:', error);
        return `Oh no! Something went wrong when checking for similar replies to "${trigger}". Please try again.`
      }
    } else {
      try {
        const dataExist = await selectData('BotReplies', key);
        if (!dataExist) {
          message = `No reply was found with ID: "${id}", check if you gave the correct ID and try again.`
        } else {
          if (action === 'update') {
            try {
              await updateData('BotReplies', key, data);
              const dataChange = await selectData('BotReplies', key);
              message = {
                old: dataExist,
                new: dataChange
              }
            } catch (error) {
              console.error('Error updating data:', error);
              return `Oh no! Something went wrong when updating the reply with ID:${key.id}. Please try again.`
            }
          } else {
            try {
              await deleteData('BotReplies', key);
              message = dataExist;
            } catch (error) {
              console.error('Error deleting data:', error);
              return `Oh no! Something went wrong when deleting the reply with ID:${key.id}. Please try again.`
            }
          }
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
        return `Oh no! Something went wrong when retrieving the reply with ID:${key.id} from the database. Please try again.`
      }
    }
    return message;
  } catch (error) {
    console.error(`Error when trying to ${action} Reply:`, error);
    return `There was an error when trying to ${action} the given data. Please try again later.`;
  }
}