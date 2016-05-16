'use strict';

const fs = require('fs');

module.exports = fs.readFile(__dirname + '/images/palette-bitmap.bmp', (err, bufferData) => {
  if (err) {
    console.log('error', err);
  }
  console.log('BUFFER DATA', bufferData);

  var bitMap = {};

  bitMap.size = bufferData.readUInt32LE(2);
  bitMap.pixelStart = bufferData.readUInt32LE(10);
  bitMap.dBISize = bufferData.readUInt32LE(12);
  bitMap.width = bufferData.readUInt32LE(18);
  bitMap.height = bufferData.readUInt32LE(22);
  bitMap.colorPalette = bufferData.readUInt32LE(54);

  console.log('DBI', bitMap.pixelStart);

  var palette = [];

  bitMap.readPalette = function() {
    var counter = 0;
    for (var i = 54; i < bitMap.pixelStart; i += 4) {
      palette[counter] = [
        bufferData.readUInt8(i),
        bufferData.readUInt8(i + 1),
        bufferData.readUInt8(i + 2),
        0];
      counter++;
    }
    // console.log(palette);
  };

  palette.transform = function(palette) {
    for (var i = 54; i < bitMap.pixelStart; i += 4) {
      var counter = 0;
      var red = palette[i] * 7;
      var green = 0;
      var blue = 0;
      palette[counter] = [
        palette[i] = red.writeUInt8(i),
        palette[i + 1] = green.writeUInt8(i + 1),
        palette[i + 2] = blue.writeUInt8(i + 2),
        0];
      counter++;
    }
    return palette;
  };
  // console.log(palette);

  var transformedPalette = palette.toString();

  bufferData.write(transformedPalette, 54, 256);

  fs.writeFile(__dirname + '/images/seven-times.bmp', bufferData, (err) => {
    if (err) {
      console.log('error', err);
    }
  });

});
