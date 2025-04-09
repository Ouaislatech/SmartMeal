const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    url: 'https://images.pexels.com/photos/2878739/pexels-photo-2878739.jpeg',
    filename: 'marche-fruits-legumes.jpg',
  },
  {
    url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    filename: 'assiette-saine.jpg',
  },
  {
    url: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg',
    filename: 'ingredients-frais.jpg',
  },
  {
    url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    filename: 'repas-equilibre.jpg',
  },
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(
      path.join(__dirname, '../public/images/programmes', filename)
    );
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(filename);
        reject(err);
      });
  });
};

const downloadAllImages = async () => {
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
      console.log(`Downloaded ${image.filename}`);
    } catch (error) {
      console.error(`Error downloading ${image.filename}:`, error);
    }
  }
};

downloadAllImages();
