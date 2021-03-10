export default class Connection {
  constructor(connectionId, sse) {
    this.connectionId = connectionId,
    this.sse = sse;
    this.subscribedTo = new Set();
  }

  subscribe(to) {
    this.subscribedTo.clear();
    this.subscribedTo = new Set(to);
  }

  publish(data) {
    this.sse.send(data);
  }
}