function setChannelOrRoleArray(id, value, data, type) {
  const index = data.findIndex(item => item[`${type}Id`] === id);
  let action; 

  if (index === -1) { // data doesn't exist
    data.push({ [`${type}Id`]: id, value });
    action = 'added';
  } else {
    if (data[index].value !== value) { // data exist but it's not the same.
      data[index].value = value;
      action = 'updated'
    } else { // data exist but it is the same
      data.splice(index, 1);
      action = 'removed'
    }
  }
  return [action, JSON.stringify(data)];
}

function setAnnounceLevelArray(levSettings, newData) {
  existingData = JSON.parse(levSettings.announceLevelMessages);
  const level = typeof newData === 'object' ? newData.lv : newData
  const index = existingData.findIndex(item => item['lv'] === level);
  let action;

  if (index === -1 && typeof newData === 'object') {
    existingData.push(newData);
    existingData.sort((a, b) => a > b);
    action = 'added';
  } else {
    if (typeof newData === 'object') {
      existingData[index] = newData;
      action = 'updated';
    } else {
      if (existingData.length !== 0) {
        existingData.splice(index, 1);
        action = 'removed';
      } else {
        action = 'error';
      }
    }
  }
  return [action, JSON.stringify(existingData)];
}

module.exports = { setChannelOrRoleArray, setAnnounceLevelArray }