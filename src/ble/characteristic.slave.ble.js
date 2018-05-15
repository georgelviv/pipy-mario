const Buffer = require('buffer').Buffer;
const Characteristic =  require('bleno').Characteristic;
const Mushroom = require('./mushroomSend');

class BLECharacteristic {
  constructor({ uuid, getReadData }) {
    this.uuid = uuid;
    this.getReadData = getReadData;

    this.preserveContenxt([
      'onReadRequest'
    ]);

    this.characteristic = new Characteristic({
      uuid: uuid,
      properties: ['read', 'write', 'notify'],
      value: null,
      onReadRequest: this.onReadRequest
    });
  }

  preserveContenxt(methods = []) {
    methods.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    })
  }

  convertDataToMsg({data, type}) {
    return {
      data,
      type,
      date: Date.now(),
      dataLength: JSON.stringify(data).length,
      packageNumber: 0,
      packageCount: 1
    };
  }

  convertIntoPackage(msg) {
    let data = JSON.stringify(msg);
    this.tempBufferSize = msg.dataLength;
    return Buffer.from(JSON.stringify(msg), 'utf8');
  }

  getCurrentPackage() {
    let mushroom = this.tempBuffer.getNextPackage();
    if (!mushroom.hasNext) delete this.tempBuffer;
    return mushroom.currentPackage;
  }

  setupPackage(cb) {
    if (!this.tempBuffer) {
      this.getReadData(({ data, type }) => {
        this.tempBuffer = new Mushroom({ data, type });
        cb(this.getCurrentPackage());
      });
    } else {
      cb(this.getCurrentPackage());
    }
  }

  onReadRequest(offset, cb) {
    this.setupPackage(mushroom => {
      cb(Characteristic.RESULT_SUCCESS, mushroom);
    });
  }
}

module.exports = BLECharacteristic;