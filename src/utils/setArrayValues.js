module.exports = async (id, value, data, type) => {
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