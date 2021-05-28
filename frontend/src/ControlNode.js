class ControlNode {
  constructor(defaults) {
    Object.entries(defaults).forEach(([key, value]) => {
      this[key] = value;
    })
    this.connections = new Set();
    this.connect = this.connect.bind(this);
    this.gateHigh = this.gateHigh.bind(this);
    this.gateLow = this.gateLow.bind(this);
  }
  connect(target) {
    this.connections.add(target);
  }

  gateHigh() {
    this.connections.forEach(target => {
    })
  }

  gateLow() {
    debugger;
  }
}

export default ControlNode;