module.exports = async (action, id, value, data, type) => {
  const index = data.findIndex(item => item[`${type}Id`] === id);

  if (action === 'insert') {
    if (index === -1) {
      data.push({ [`${type}Id`]: id, value });
    } else {
      data[index].value = value;
    }
  } else if (action === 'remove') {
    if (index === -1) {
      data.splice(index, 1);
    }
  }
  return JSON.stringify(data);
}