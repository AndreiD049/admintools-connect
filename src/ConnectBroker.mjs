import ConnectSession from './ConnectSession.mjs';

class ConnectBroker {
  constructor() {
    // Sessions, a map of form - user: ConnectSession
    this.sessions = new Map();
  }

  connect(userId, connectionId, sse) {
    // Check if user is already present in sessions
    if (!this.sessions.has(userId)) {
      // Create the user Connection Session;
      this.sessions.set(userId, new ConnectSession(userId));
    }
    this.sessions.get(userId).addConnection(connectionId, sse)
  }

  closeConnection(userId, connectionId) {
    if (this.sessions.has(userId)) {
      this.sessions.get(userId).closeConnection(connectionId)
    }
  }

  subscribe(userId, connectionId, to) {
    if (this.sessions.has(userId)) {
      this.sessions.get(userId).subscribe(connectionId, to);
    }
  }
};

export default new ConnectBroker();