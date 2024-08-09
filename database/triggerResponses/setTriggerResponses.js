const { selectData } = require('../controlData/selectData');

async function setTriggerResponses(trigger, response) {
  const { customAlphabet } = await import('nanoid');
  const numbers = '0123456789';

  const generateNumericId = customAlphabet(numbers, 11);

  const key = {
    id: generateNumericId()
  }

  const data = {
    trigger: trigger,
    response: response
  }


  const dataExist = await selectData('TriggerResponses', key)
  console.log(dataExist)
}

module.exports = { setTriggerResponses };