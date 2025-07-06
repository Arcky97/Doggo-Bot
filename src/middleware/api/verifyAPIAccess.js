import dotenv from 'dotenv';
dotenv.config();

export default (req, res, next) => {
  if (req.query.token !== process.env.API_TOKEN) {
    console.log('Access not granted!');
    return res.status(403).json({ error: 'Access Denied!' });
  }
  console.log('Access granted!');
  next();
};