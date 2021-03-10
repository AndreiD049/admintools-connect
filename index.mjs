import express from 'express';
import dotenv from 'dotenv';
import API from './src/api.mjs';
import NRP from 'node-redis-pubsub';
import config from './src/config.mjs';

const publisher = new NRP({
  host: config.REDIS_HOST,
  password: config.REDIS_PASSWORD,
});

// setInterval(() => {
//   publisher.emit('tasks:1234', { test: 'data' });
// }, 5000);

const app = express();
app.use(express.urlencoded());
app.use(express.json());
const port = 3004;
// Load the user
app.use(async (req, res, next) => {
  const headUser = JSON.parse(req.header('user'));
  if (headUser !== null) {
    req.user = headUser;
  } else {
    return res.status(403).end();
  }
  next();
});

app.use('/stream', API);

app.listen(port, () => {
  console.log(`Application listens on port ${port}`);
});