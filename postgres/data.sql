-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table for images (PDF, PNG, etc.)
CREATE TABLE IF NOT EXISTS images (
  name TEXT PRIMARY KEY,
  img BYTEA
);

-- Table for videos
CREATE TABLE IF NOT EXISTS videos (
  name TEXT PRIMARY KEY,
  video BYTEA
);

-- Table for audios
CREATE TABLE IF NOT EXISTS audios (
  name TEXT PRIMARY KEY,
  audio BYTEA
);

-- Unified media table for image + video pairs with UUIDs
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY,
  image BYTEA,
  video BYTEA
);

-- Optional permissions (can be removed if using users/roles)
GRANT SELECT, INSERT, UPDATE, DELETE ON images, videos, audios, media TO PUBLIC;