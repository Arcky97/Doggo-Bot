module.exports = (input, format, parse = true) => {
  const data = parse ? JSON.parse(input) : input;
  return data.map(d => 
    format.replace(/\${(.*?)}/g, (_, key) => d[key] || '')
  ).join('\n').trim() || 'none'
};