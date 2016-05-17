'use strict';

const fs = require('fs');

module.exports = fs.readFile(__dirname + '/images/palette-bitmap.bmp', (err, bufferData) => {
  if (err) {
    console.log('error', err);
  }
  // console.log('BUFFER DATA', bufferData);

  var bitMap = {};

  bitMap.size = bufferData.readUInt32LE(2);
  bitMap.pixelStart = bufferData.readUInt32LE(10);
  bitMap.dBISize = bufferData.readUInt32LE(12);
  bitMap.width = bufferData.readUInt32LE(18);
  bitMap.height = bufferData.readUInt32LE(22);
  bitMap.colorPalette = bufferData.readUInt32LE(54);

  // console.log('DBI', bitMap.pixelStart);

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
    // console.log(palette.length);
    // console.log(((bitMap.pixelStart - 54) / 4), 'expect 256');
  };

  bitMap.readPalette();

  palette.transform = function(data) {
    // var blah = [];
    for (var i = 0; i < data.length; i ++) {
      // var colors = [];
      var red = 0;//Math.floor(Math.random() * 255);
      var green = 0;//Math.floor(Math.random() * 255);
      var blue = 0;//Math.floor(Math.random() * 255);
      // colors.push(red, green, blue, 0);
      // blah[i] = colors;
      data[i] = [red, green, blue, 0]
        ;
    }
    return data;
  };

  // var writeToBuffer = function(data) {
  //   var counter = 0;
  //   for (var i = 0; i < data.length; i++) {
  //     data[counter] = [
  //       data.writeUInt8(i),
  //       data.writeUInt8(i + 1),
  //       data.writeUInt8(i + 2),
  //       0];
  //     counter++;
  //   }
  //   return palette;
  // };

  // writeToBuffer(transformedPalette);

  var transformedPalette = palette.transform(palette);
  var bigArray = [];

  transformedPalette.forEach(function(item) {
    item.forEach(function(item2) {
      bigArray.push(item2);
    });
  });
  // console.log('transpal', transformedPalette);
  // console.log('bigArray', bigArray.length, bigArray);
  //
  // console.log(transformedPalette.length, 'transformedPalette');

  var paletteBuffer = new Buffer(bigArray);
  var header = bufferData.slice(0, 54);
  var tail = bufferData.slice(1078);

  var newBuffer = Buffer.concat([header, paletteBuffer, tail]);
  console.log('newBufferlength', newBuffer.length);

  console.log('section', bufferData.slice(54, 1078), bufferData.slice(54, 1078).length);

  bufferData.writeUInt8(transformedPalette, 54, 256);
  // console.log(bufferData.readUInt8(54, 256));

  fs.writeFile(__dirname + '/images/seven-times.bmp', newBuffer, (err) => {
    if (err) {
      console.log('error', err);
    }
  });

});
