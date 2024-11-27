const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Function to get all images from a directory recursively
function getImagesFromDir(dirPath) {
  const images = [];
  const files = fs.readdirSync(dirPath);
  console.log('Found directories:', files);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      console.log(`Processing directory: ${file}`);
      const provider = file;
      try {
        const providerFiles = fs.readdirSync(fullPath);
        console.log(`Found ${providerFiles.length} files in ${file}`);
        
        const providerImages = providerFiles
          .filter(imgFile => /\.(jpg|jpeg|png|webp)$/i.test(imgFile))
          .map((imgFile, index) => {
            console.log(`Processing image: ${imgFile}`);
            return {
              id: images.length + index + 1,
              provider: provider.charAt(0).toUpperCase() + provider.slice(1),
              image: `/images/${provider}/${imgFile}`,
              name: imgFile.replace(/\.(jpg|jpeg|png|webp)$/i, '')
                .split(/[-_]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
            };
          });
        
        console.log(`Added ${providerImages.length} images for ${file}`);
        images.push(...providerImages);
      } catch (error) {
        console.error(`Error processing directory ${file}:`, error);
      }
    }
  });

  return images;
}

// API endpoint to get all game images
app.get('/api/games', (req, res) => {
  try {
    const imagesPath = path.join(__dirname, '../public/images');
    console.log('Reading images from:', imagesPath);
    const images = getImagesFromDir(imagesPath);
    console.log(`Total images found: ${images.length}`);
    res.json(images);
  } catch (error) {
    console.error('Error reading images:', error);
    res.status(500).json({ error: 'Failed to read images' });
  }
});

// API endpoint to get providers list
app.get('/api/providers', (req, res) => {
  try {
    const imagesPath = path.join(__dirname, '../public/images');
    const files = fs.readdirSync(imagesPath);
    const providers = files
      .filter(file => fs.statSync(path.join(imagesPath, file)).isDirectory())
      .map(dir => ({
        id: dir,
        name: dir.charAt(0).toUpperCase() + dir.slice(1)
      }));
    res.json(providers);
  } catch (error) {
    console.error('Error reading providers:', error);
    res.status(500).json({ error: 'Failed to read providers' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
