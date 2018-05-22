const BLEConfigs = require('./configs').BLE;
const initBLE = require('./src').initBLE;
const readDTH = require('./src').sensors.dth;

const getTimeDiff = require('./src/helpers').getTimeDiff;

initBLE({
  configs: BLEConfigs,
  getReadData: getReadData
});

function getReadData(cb) {
  const timeBeforeRequest = new Date();
  readDTH().then((dataFromSensor) => {
    dataFromSensor.sensorReadLatancy = getTimeDiff(timeBeforeRequest)
    cb({
      type: 'text',
      data: dataFromSensor
    });
  }).catch(err => {
    console.error(err);
    process.exit();
  }) 
}