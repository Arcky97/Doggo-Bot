const { customAlphabet } = require('nanoid');
const { setData } = require('../controlData/setData');
const { selectData } = require('../controlData/selectData');

async function setTriggerResponses(trigger, response) {
  const numbers = '0123456789';

  const generateNumericId = customAlphabet(numbers, 11);

  const data = {
    id: generateNumericId(),
    trigger: trigger,
    response: response
  }

  console.log(data);
  const dataExist = await selectData('TriggerResponses', data, ['id'])
  
  //setData('TriggerResponses', data, ['id'])
}

module.exports = { setTriggerResponses };