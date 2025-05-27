import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:museum.db',
});

export const initializeDatabase = async () => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS exhibits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      imageUrl TEXT NOT NULL,
      year INTEGER NOT NULL,
      category TEXT NOT NULL,
      technicalDetails TEXT,
      historicalContext TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      userId TEXT NOT NULL,
      exhibitId INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, exhibitId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (exhibitId) REFERENCES exhibits(id)
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS recently_viewed (
      userId TEXT NOT NULL,
      exhibitId INTEGER NOT NULL,
      viewedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, exhibitId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (exhibitId) REFERENCES exhibits(id)
    );
  `);
};

export const db = client;