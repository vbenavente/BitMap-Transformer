'use strict';

const fs = require('fs');

//  open file with fs and read file into a buffer
module.exports = fs.readFile(__dirname + '/images/palette-bitmap.bmp', (err, bufferData) => {
  if (err) {
    console.log('error', err);
  }

// convert buffer into a JavaScript Object
  var bitMap = {};

  bitMap.size = bufferData.readUInt32LE(2);
  bitMap.pixelStart = bufferData.readUInt32LE(10);
  bitMap.dBISize = bufferData.readUInt32LE(12);
  bitMap.colorPalette = bufferData.readUInt32LE(54);

// read color palette into an array of integers
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

  };
// call readPalette function!
  bitMap.readPalette();

// change values (transform palette) for r,g,b to change colors in palette
  palette.transform = function(data) {
    for (var i = 0; i < data.length; i++) {
      var red = Math.floor(Math.random() * 255);
      var green = Math.floor(Math.random() * 255);
      var blue = Math.floor(Math.random() * 255);

      data[i] = [red, green, blue, 0]
        ;
    }
    return data;
  };

//  call transform function! and store array in variable
  var transformedPalette = palette.transform(palette);
//  make one big array out of all nested arrays
  var bigArray = [];

  transformedPalette.forEach(function(item) {
    item.forEach(function(item2) {
      bigArray.push(item2);
    });
  });

//  create new buffer of transformed color palette
  var paletteBuffer = new Buffer(bigArray);
  var header = bufferData.slice(0, 54);
  var tail = bufferData.slice(1078);

// concatonate header, transformed buffer and tail to read to file
  var newBuffer = Buffer.concat([header, paletteBuffer, tail]);

//  write new buffer to file
  fs.writeFile(__dirname + '/images/transformed-bitmap.bmp', newBuffer, (err) => {
    if (err) {
      console.log('error', err);
    }
  });

});
