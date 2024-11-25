function setChannelOrRoleArray({type, data, id, value, replace, remove}) {
  const index = data.findIndex(item => item[`${type}Id`] === id);
  let action; 

  if (index === -1 && !remove) { // data doesn't exist
    if (value) {
      if (replace !== undefined) {
        data.push({ [`${type}Id`]: id, value, replace });
      } else {
        data.push({ [`${type}Id`]: id, value });
      }
    } else {
      data.push({ [`${type}Id`]: id});
    }
    action = 'added';
  } else {
    if (!remove && value && data[index].value !== value || replace !== undefined && data[index].replace !== replace) { // data exist but it's not the same. (value)
      data[index].value = value;
      if (replace !== undefined) data[index].replace = replace;
      action = 'updated';
    } else { // data exist but it is the same
      if (index !== -1) {
        data.splice(index, 1);
        action = 'removed';
      }
    }
  }
  return [action, JSON.stringify(data)];
}

function setLevelRolesArray(action, data, level, id) {
  const index = data.findIndex(item => item.level === level);
  if (action === 'add') {
    if (index === -1) {
      data.push({ level, roleId: id})
      action = 'set';
    } else {
      data[index].roleId = id;
      action = 'updated';
    }
    data = data.sort((a, b) => a.level - b.level);
  } else {
    data.splice(index, 1);
    action = 'removed';
  }
  return [action, JSON.stringify(data)];  
}

function setAnnounceLevelArray(levSettings, newData) {
  existingData = JSON.parse(levSettings.announceLevelMessages);
  const level = typeof newData === 'object' ? newData.lv : newData
  const index = existingData.findIndex(item => item.lv === level);
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

module.exports = { setChannelOrRoleArray, setAnnounceLevelArray, setLevelRolesArray }