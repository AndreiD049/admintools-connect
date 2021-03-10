import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import SSE from './SSE.js';
import Broker from './ConnectBroker.mjs';
const Router = express.Router();

Router.get('/', (req, res, next) => {
  try {
    const id = uuidv4();
    const sse = new SSE(id, { initialEvent: 'init' });
    sse.init(req, res);
    Broker.connect(req.user.id, id, sse);
    req.once('close', () => {
      Broker.closeConnection(req.user.id, id);
    });
  } catch (err) {
    next(err);
  }
});

Router.post('/subscribe', async (req, res, next) => {
  try {
    const { to, connectionId } = req.body;
    Broker.subscribe(req.user.id, connectionId, to);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

export default Router;