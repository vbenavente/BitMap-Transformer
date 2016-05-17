const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const palette = require('../lib/bit-transform');

describe('bitmap transform testing', () => {
  it('Should give new values for color palette', () => {
    let array = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    expect(palette.transform(array)).to.eql([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
  });
  it('write a new image to a file', () => {
    let image = fs.readFile('/lib/images/palette-bitmap.bmp');
    let transformedImage = fs.readFile('/lib/images/transformed-bitmap.bmp');
    expect(image).to.not.eql(transformedImage);
  });
});
