const { spawn } = require('child_process');
const path = require('path');

const pathToReadScript = path.resolve(__dirname, './readdth.py');

const parseOutput = output => {
  let params = {};

  output.trim().split(' ').forEach(param => {
    const splitedValues = param.split('=');
    switch (splitedValues[0]) {
      case 'Temp':
        params['temperature'] = splitedValues[1]; 
      case 'Humidity':
        params['humidity']  = splitedValues[1];
    }
  })

  return params;
};

const readDTH = (DTHModule = 11, pin = 23) => {
  return new Promise((resolve, reject) => {

    const child = spawn('python', [pathToReadScript, pin]);
    let dataStderr = '';
    let dataStdout = '';

    child.stdout.on('data', (data) => {
      dataStdout += data;
    });

    child.stderr.on('data', (data) => {
      dataStderr += data;
    });

    child.on('exit', function (code, signal) {
      if (code !== 0) {
        console.log(`child process exited with code ${code} and signal ${signal}`);
        reject(dataStderr);
      }
      resolve(parseOutput(dataStdout));
    });
  });
};

module.exports = readDTH;