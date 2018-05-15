const readDTH = require('./src').sensors.dth;

readDTH().then((dataFromSensor) => {
  console.log(dataFromSensor);
}).catch(err => {
  console.error(err);
  process.exit();
}) 