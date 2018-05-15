const Buffer = require('buffer').Buffer
const MAXIMUM_PACKAGE_LENGTH = 248;

class MushroomSend {
  constructor({ data, type }) {
    this.data = data;
    this.type = type;
    this.msg = this.getMsg();
    this.msgLength = this.msg.length;

    this.packageDataLength = this.calculatePackageDataLength();
    this.packagesCount = this.calculatePackagesCount();
    this.packages = this.splitIntoPackages();

    this.packageIndex = 0;
  }

  splitIntoPackages() {
    let packages = [];
    for (let i = 0; i < this.packagesCount; i++) {
      let from = i * this.packageDataLength;
      let currentPackage = `${ this.msg.slice(from, from + this.packageDataLength) };${ i }-${ this.packagesCount }`;
      packages[i] = Buffer.from(currentPackage, 'utf8');
    }
    return packages;
  }

  calculatePackageDataLength() {
    let clearCount = Math.ceil(this.msgLength / MAXIMUM_PACKAGE_LENGTH);
    // 'data,currentPackage,count'
    let legnthPackageCount = (JSON.stringify(clearCount).length + 1) * 2; 
    let newMaximum = MAXIMUM_PACKAGE_LENGTH - legnthPackageCount;

    return newMaximum;
  }

  calculatePackagesCount() {
    return Math.ceil(this.msgLength / this.packageDataLength)
  }

  getMsg() {
    return JSON.stringify({
      date: new Date(),
      type: this.type,
      data: this.data
    });
  }

  getNextPackage() {
    let currentPackage = this.packages[this.packageIndex];
    let hasNext = this.packagesCount > this.packageIndex + 1;
    this.packageIndex += 1;

    return { currentPackage, hasNext };
  }
}

module.exports = MushroomSend;