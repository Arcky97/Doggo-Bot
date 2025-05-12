require('dotenv').config();

module.exports = (req, res, next) => {
  if (req.query.token !== process.env.API_TOKEN) {
    console.log('Access not granted!');
    return res.status(403).json({ error: 'Access Denied!' });
  }
  console.log('Access granted!');
  next();
}