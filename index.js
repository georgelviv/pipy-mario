const BLEConfigs = require('./configs').BLE;
const initBLE = require('./src').initBLE;
const readDTH = require('./src').sensors.dth;

initBLE({
  configs: BLEConfigs,
  getReadData: getReadData
});


function getReadData(cb) {
  readDTH().then((dataFromSensor) => {
    cb({
      type: 'text',
      data: dataFromSensor
    });
  }).catch(err => {
    console.error(err);
    process.exit();
  }) 
}