const EventEmitter = require('events');
const bleno = require('bleno');
const onExit = require('../helpers').onExit;

const BLE_SLAVE_MODULE_STATE = {
  poweredOn: 'poweredOn'
};

const BLE_SLAVE_MODULE_EVENTS = {
  stateChange: 'stateChange'
};

class BLESlave {
  constructor() {
    this.state;
    this.isAdvertising = false;
    this.isServiceSetted = false;
    this.service;
    this.ee = new EventEmitter();

    this.preserveContenxt([
      'onStateChange', 'onExit'
    ]);

    bleno.on('stateChange', this.onStateChange);
  }

  onExit() {
    this.stopAdvertising();
  }

  preserveContenxt(methods = []) {
    methods.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    })
  }

  log(msg) {
    console.log(`BLE Slave: ${ msg }`);
  }

  onStateChange(newState) {
    this.state = newState;
    this.log(`state changed to: ${ newState }`);
    this.ee.emit(BLE_SLAVE_MODULE_EVENTS.stateChange, newState);
    if (!BLE_SLAVE_MODULE_STATE.poweredOn) {
      this.stopAdvertising();
    }
  }

  startAdvertisingService(service) {
    this.service = service;
    if (this.isAdvertising) {
      this.stopAdvertising();
    }
    if (this.state === BLE_SLAVE_MODULE_STATE.poweredOn) {s
      this.startAdvertising();
    } else {
      let cb = (state) => {
        if (state === BLE_SLAVE_MODULE_STATE.poweredOn) {
          this.ee.removeListener(BLE_SLAVE_MODULE_EVENTS.stateChange, cb);
          this.startAdvertising();
        }
      };
      this.ee.on(BLE_SLAVE_MODULE_EVENTS.stateChange, cb);
    }
  }

  startAdvertising() {
    let serviceName = this.service.name;
    bleno.startAdvertising(serviceName, [this.service.uuid], err => {
      if (err) throw err;
      this.isAdvertising = true;
      this.log(`service '${ serviceName }' started advertising`);
      this.setService();
    });   
  }

  setService() {
    if (!this.isAdvertising) return;
    let services = [this.service.service];
    bleno.setServices(services, (err) => {
      if (err) throw err;
      this.isServiceSetted = true;
      this.log(`service '${ this.service.name }' setted with next uuid:`);
      this.log(this.service.uuid);
    });
  }

  stopAdvertising() {
    this.isAdvertising = false;
    bleno.stopAdvertising();
    this.log('advertising stopped');
  }
}

module.exports = BLESlave;



