CREATE TABLE images (name text, img bytea, UNIQUE(name));
CREATE TABLE videos (name text, video bytea, UNIQUE(name));
CREATE TABLE audios (name text, audio bytea, UNIQUE(name));