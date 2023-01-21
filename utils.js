const path = require('path');
const sharp = require('sharp');

function processUploadedImages(job) {

    console.log('We are running a queue of uploaded images');
    console.log(job);

  const imageFileData = Buffer.from(job.image.data, 'base64');

  // get the name of the file
  const imageName = path.parse(job.image.name).name;

  const processImage = (size) =>
    sharp(imageFileData)
      .resize(size, size)
      .webp({ lossless: true })
      .toFile(`./public/images/${imageName}-${size}.webp`);

  sizes = [90, 96, 120, 144, 160, 180, 240, 288, 360, 480, 720, 1440];
  Promise.all(sizes.map(processImage));

  let counter = 0;
  for (let i = 0; i < 10_000_000_000; i++) {
    counter++;
  }
}

module.exports = { processUploadedImages };
