import redis from 'redis';
import NRP from 'node-redis-pubsub';
import config from './config.mjs';
import Connection from './Connection.mjs';

const taskChannel = 'tasks';

export default class ConnectSession {
  constructor(userId) {
    this.userId = userId;
    this.subscriber = this.createClient();
    // map of connection id to the Connection object
    this.connections = new Map();
    this.disposeTimer = 0;
  }

  subscribe(connectionId, to) {
    // First, check if connectionId is valid, and can be found
    if (this.connections.has(connectionId)) {
      this.clearDispose();
      // if valid, add subscribtions to connection
      const connection = this.connections.get(connectionId);
      connection.subscribe(to);
    }
  }

  addConnection(connectionId, sse) {
    this.clearDispose();
    this.connections.set(connectionId, new Connection(connectionId, sse));
  }

  closeConnection(connectionId) {
    this.connections.delete(connectionId);
    // there are no more connections left for this user
    // all instances are closed, we can dispose the connection in 5 minutes
    if (this.connections.size === 0) {
      this.setDispose();
    }
  }

  createClient() {
    const subscriber =  new NRP({ 
      host: config.REDIS_HOST,
      password: config.REDIS_PASSWORD,
    });
    // Tasks listener
    subscriber.on(taskChannel, (data) => {
      const {target} = data;
      this.connections.forEach((connection) => {
        if (connection.subscribedTo.has(target) || this.userId === target) {
          connection.publish(data);
        }
      })
    });

    return subscriber;
  }

  setDispose() {
    this.disposeTimer = setTimeout(() => {
      this.subscriber.quit();
      this.subscriber = null;
    }, 60000);
  }

  clearDispose() {
    clearTimeout(this.disposeTimer);
    if (!this.subscriber) {
      this.subscriber = this.createClient();
    }
  }

};