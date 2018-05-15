const PrimaryService = require('bleno').PrimaryService;

class BLEServices {
  constructor({ name, uuid, characteristic }) {
    this.name = name;
    this.uuid = uuid;
    this.characteristic = characteristic;
    this.service = new PrimaryService({
      uuid: this.uuid,
      characteristics: [characteristic.characteristic]
    })
  }
};

module.exports = BLEServices;