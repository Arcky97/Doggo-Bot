
const { selectData } = require('../controlData/selectData');
const { query } = require('../db');
const { insertData } = require('../controlData/insertData');
const { deleteData } = require('../controlData/deleteData');
const { updateData } = require('../controlData/updateData');
const { exportToJson } = require('../controlData/visualDatabase/exportToJson');

async function getTriggers() {
  try {
    const [rows] = await query('SELECT triggers FROM TriggerResponses');

    return rows.map(row => row.triggers);
  } catch (error) {
    console.error('Error fetching triggers:', error);
    return [];
  }
}

async function findClosestMatch(target, array) {
  const { default: leven } = await import('leven');
  let closestMatch = null;
  let smallestDistance = 15;

  array.forEach((str) => {
    const distance = leven(target, str);
    if (distance <= smallestDistance) {
      smallestDistance = distance;
      console.log(smallestDistance);
      closestMatch = str;
    }
  });
  return closestMatch;
}


async function setTriggerResponses({ trigger, response, action, id }) {
  const { customAlphabet } = await import('nanoid');
  const numbers = '0123456789';

  const generateNumericId = customAlphabet(numbers, 11);
  let key; 
  let data;

  if (action === "insert") {
    key = {
      id: generateNumericId()
    }

    data = {
      triggers: trigger,
      responses: response
    }
  } else { // update or delete
    key = {
      id: id 
    }
  }

  let message;
  try {
    if (action === "insert") {
      const triggers = await getTriggers();
      const closestMatch = await findClosestMatch("trigger", triggers);
      console.log(closestMatch);
      if (closestMatch) {
        message = `The trigger "${closestMatch}" seems similar to the trigger you're trying to add. Do you want to add "${response}" to this trigger instead?`;
      } else {
        console.log("we insert the date since it doesn't exist in the database!")
        await insertData('TriggerResponses', key, data);
        message = "reply successfully added!"
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
          deleteData('TriggerResponse', key);
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

module.exports = { setTriggerResponses };