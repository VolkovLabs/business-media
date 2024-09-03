const ws = require('ws');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

const images = fs.readdirSync(imagesDir).filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file));

let currentIndex = 0;

/**
 * Server
 */
const server = new ws.WebSocketServer({ port: 8090 });

/**
 * Convert Image to Base64
 */
const convertImageToBase64 = (imagePath) => {
  const imageData = fs.readFileSync(imagePath);
  return Buffer.from(imageData).toString('base64');
};

/**
 * Send Data
 */
const sendData = (socket) => {
  const imagePath = path.join(imagesDir, images[currentIndex]);
  const base64Image = convertImageToBase64(imagePath);

  const json = [{ name: images[currentIndex], image: `data:image/png;base64,${base64Image}` }];

  socket.send(JSON.stringify(json));

  currentIndex = (currentIndex + 1) % images.length;

  setTimeout(() => {
    sendData(socket);
  }, 100);
};

/**
 * Connection
 */
server.on('connection', (socket) => {
  console.log('Connected...');

  setTimeout(() => {
    sendData(socket);
  }, 1000);
});
