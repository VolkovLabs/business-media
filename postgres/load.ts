const fs = require('fs');
const { Client } = require('pg');

/**
 * Postgres credentials from ENV
 */
const host = process.env.POSTGRES_HOST;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;

async function loadFile() {
  const client = new Client({ host, user, password });
  await client.connect();

  /**
   * Load PDF
   */
  const pdfData = fs.readFileSync('./postgresql-14-US.pdf');
  await client.query('INSERT INTO images VALUES($1, $2)', ['postgresql-14-US', pdfData]);

  /**
   * Load Image
   */
  const imgData = fs.readFileSync('./image-panel.png');
  await client.query('INSERT INTO images VALUES($1, $2)', ['image-panel', imgData]);

  /**
   * Load Video
   */
  const videoData = fs.readFileSync('./9.mp4');
  await client.query('INSERT INTO videos VALUES($1, $2)', ['flow', videoData]);

  /**
   * Load Audio
   */
  const audioData = fs.readFileSync('./call.mp3');
  await client.query('INSERT INTO audios VALUES($1, $2)', ['call', audioData]);

  const mediaFiles = [
    {
      id: '11111111-1111-4111-8111-111111111111',
      imagePath: './jupiter.jpg',
      videoPath: './jupiter.mp4',
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      imagePath: './saturn.jpg',
      videoPath: './saturn.mp4',
    },
  ];

  for (const { id, imagePath, videoPath } of mediaFiles) {
    const imageData = fs.readFileSync(imagePath);
    const videoData = fs.readFileSync(videoPath);

    await client.query('INSERT INTO media (id, image, video) VALUES ($1, $2, $3)', [id, imageData, videoData]);
    console.log(`Inserted media: ${id}`);
  }

  const result = await client.query(
    'SELECT count(1) FROM images UNION ALL SELECT count(1) FROM videos UNION ALL SELECT count(1) FROM audios UNION ALL SELECT count(1) FROM media'
  );
  console.log('SELECT Result:', result.rows);

  await client.end();
}

loadFile();
