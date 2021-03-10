import express from 'express';
import API from './src/api.mjs';

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