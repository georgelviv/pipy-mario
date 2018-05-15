const { BLESlave, BLEService, BLECharacteristic } = require('./ble');

const initBLE = ({ configs, getReadData }) => {

  const marioSlave = new BLESlave();
  const marioCharacteristic = new BLECharacteristic({
    uuid: configs.characteristicUUID,
    getReadData: getReadData
  });
  const mushroomService = new BLEService({
    name: configs.serviceName,
    uuid: configs.serviceUUID,
    characteristic: marioCharacteristic
  });
  marioSlave.startAdvertisingService(mushroomService);
}


module.exports = {
  initBLE: initBLE
};
