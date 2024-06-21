const fs = require('fs');
const { Client } = require('pg');

/**
 * Postgres
 */
const host = process.env.POSTGRES_HOST;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;

async function loadFile() {
  /**
   * Connect to Postgres
   */
  const client = new Client({ host, user, password });
  await client.connect();

  /**
   * Load PDF to Postgres
   */
  const pdfData = fs.readFileSync('./postgresql-14-US.pdf');

  const existingRecordPdf = await client.query('SELECT * FROM images WHERE name = $1', ['postgresql-14-US']);

  if (existingRecordPdf.rows.length > 0) {
    console.log(`Record with name 'postgresql-14-US' already exists. Skipping insertion.`);
  } else {
    await client.query('INSERT INTO images VALUES($1, $2)', ['postgresql-14-US', pdfData]);
  }

  /**
   * Load Image to Postgres
   */
  const imgData = fs.readFileSync('./image-panel.png');
  const existingRecordImg = await client.query('SELECT * FROM images WHERE name = $1', ['image-panel']);

  if (existingRecordImg.rows.length > 0) {
    console.log(`Record with name 'image-panel' already exists. Skipping insertion.`);
  } else {
    await client.query('INSERT INTO images VALUES($1, $2)', ['image-panel', imgData]);
  }

  /**
   * Load Video to Postgres
   */
  const videoData = fs.readFileSync('./9.mp4');

  const existingRecordVideo = await client.query('SELECT * FROM images WHERE name = $1', ['flow']);

  if (existingRecordVideo.rows.length > 0) {
    console.log(`Record with name 'flow' already exists. Skipping insertion.`);
  } else {
    await client.query('INSERT INTO videos VALUES($1, $2)', ['flow', videoData]);
  }

  /**
   * Load Audio to Postgres
   */
  const audioData = fs.readFileSync('./call.mp3');

  const existingRecordAudio = await client.query('SELECT * FROM images WHERE name = $1', ['call']);

  if (existingRecordAudio.rows.length > 0) {
    console.log(`Record with name 'call' already exists. Skipping insertion.`);
  } else {
    await client.query('INSERT INTO audios VALUES($1, $2)', ['call', audioData]);
  }

  /**
   * Check number of records
   */
  const res = await client.query(
    'select count(1) from images union select count(1) from videos union select count(1) from audios'
  );
  console.log('SELECT Result', res.rows);

  /**
   * End Session
   */
  await client.end();
}

loadFile();
