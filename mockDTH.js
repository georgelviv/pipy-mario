const BLEConfigs = require('./configs').BLE;
const initBLE = require('./src').initBLE;

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

function readDTH() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ temperature: '28.0*C', humidity: '19.0%' });
    }, 100);
  })
}