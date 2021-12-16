const fs = require('fs');
const { Client } = require('pg');

async function loadFile() {
  /**
   * Connect to Postgres
   */
  const client = new Client({ user: 'postgres', password: 'postgres' });
  await client.connect();

  /**
   * Load PDF to Postgres
   */
  const pdfData = fs.readFileSync('./postgresql-14-US.pdf');
  await client.query('INSERT INTO images VALUES($1, $2)', ['postgresql-14-US', pdfData]);

  /**
   * Load Image to Postgres
   */
  const imgData = fs.readFileSync('../src/img/image-panel.png');
  await client.query('INSERT INTO images VALUES($1, $2)', ['image-panel', imgData]);

  /**
   * Check number of records
   */
  const res = await client.query('Select count(1) from images');
  console.log('SELECT Result', res.rows);

  /**
   * End Session
   */
  await client.end();
}

loadFile();
