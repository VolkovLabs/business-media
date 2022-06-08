const fs = require('fs');
const { Client } = require('pg');

/**
 * Postgres Host
 */
let host = process.env.POSTGRES_HOST;
if (!host) {
  host = 'host.docker.internal';
}

/**
 * Postgres User
 */
let user = process.env.POSTGRES_USER;
if (!user) {
  user = 'postgres';
}

/**
 * Postgres Password
 */
let password = process.env.POSTGRES_PASSWORD;
if (!password) {
  password = 'postgres';
}

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
