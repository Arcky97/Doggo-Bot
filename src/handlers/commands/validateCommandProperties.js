const validProperties = {
  3: ['choices', 'required', 'autocomplete'],
  4: ['choices', 'required', 'autocomplete', 'minValue', 'maxValue'],
  10: ['choices', 'required', 'autocomplete', 'minValue', 'maxValue'],
  5: ['required'],
  6: ['required'],
  7: ['required', 'channelTypes'],
  8: ['required'],
  9: ['required'],
  11: ['required']
};

const validateOptions = (options, commandName) => {
  for (const option of options) {
    if (option.type === 1 || option.type === 2) {
      if (option.options) {
        const isValid = validateOptions(option.options, commandName);
        if (!isValid) return false;
      }
      continue;
    }

    const validProps = validProperties[option.type];
    if (!validProps) {
      console.warn(`Unknown type "${option.type}" for command "${command.name}".`);
      continue;
    }

    for (const key of Object.keys(option)) {
      if (key === 'name' || key === 'description' || key === 'type') continue;

      if (!validProps.includes(key)) {
        console.error(
          `Invalid property "${key}" for type "${option.type}" in command "${commandName}".`
        );
        return false;
      }
    }
  }
  return true;
};

module.exports = (command) => {
  const { options = [] } = command;

  return validateOptions(options, command.name);
}