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
  await client.query('INSERT INTO images VALUES($1, $2)', ['postgresql-14-US', pdfData]);

  /**
   * Load Image to Postgres
   */
  const imgData = fs.readFileSync('./image-panel.png');
  await client.query('INSERT INTO images VALUES($1, $2)', ['image-panel', imgData]);

  /**
   * Load Video to Postgres
   */
  const videoData = fs.readFileSync('./9.mp4');
  await client.query('INSERT INTO videos VALUES($1, $2)', ['flow', videoData]);

  /**
   * Load Audio to Postgres
   */
  const audioData = fs.readFileSync('./call.mp3');
  await client.query('INSERT INTO audios VALUES($1, $2)', ['call', audioData]);

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
