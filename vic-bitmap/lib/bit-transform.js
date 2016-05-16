'use strict';

const fs = require('fs');

module.exports = fs.readFile(__dirname + '/images/palette-bitmap.bmp', (err, bufferData) => {
  if (err) {
    console.log('error', err);
  }
  console.log(bufferData);
  var myObj = function(bufferData) {
    this.size = bufferData.readUInt32LE(2);
    this.pixelStart = bufferData.readUInt32LE(10);
    this.width = bufferData.readUInt32LE(18);
    this.height = bufferData.readUInt32LE(22);
    this.colorPalette = bufferData.readUInt32LE(54);
  };

  console.log(myObj);

  var palette = [];

  var readPalette = function(bufferData) {
    var counter = 0;
    for (var i = 54; i < 182; i += 4) {
      palette[i] = [
        bufferData.readUInt8(i),
        bufferData.readUInt8(i + 1),
        bufferData.readUInt8(i + 2),
        0];
      counter++;
    }
  };

  readPalette(bufferData);

  palette.transform = function(palette) {
    for (var i = 0; i < palette.length; i++) {
      var c = i * 7;
      palette[i] = [
        bufferData.readUInt8(c),
        bufferData.readUInt8(c + 1),
        bufferData.readUInt8(c + 2),
        0];
    }
    return palette;
  };
  console.log(palette);

  var transformedPalette = palette.toString();

  bufferData.write(transformedPalette, 54, 256);

  fs.writeFile(__dirname + '/images/seven-times.bmp', bufferData, (err) => {
    if (err) {
      console.log('error', err);
    }
  });

});
