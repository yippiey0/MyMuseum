import { createClient } from '@libsql/client';
import exhibits from '../data/exhibits';

const client = createClient({
  url: 'file:museum.db',
});

export const initializeDatabase = async () => {
  try {
    // Create users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
      );
    `);

    // Create exhibits table
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

    // Create favorites table
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

    // Create recently_viewed table
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

    // Check if exhibits table is empty
    const result = await client.execute('SELECT COUNT(*) as count FROM exhibits');
    const count = result.rows[0].count;

    // Migrate static data if exhibits table is empty
    if (count === 0) {
      for (const exhibit of exhibits) {
        await client.execute({
          sql: `
            INSERT INTO exhibits (
              id, name, description, imageUrl, year, category, 
              technicalDetails, historicalContext
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            exhibit.id,
            exhibit.name,
            exhibit.description,
            exhibit.imageUrl,
            exhibit.year,
            exhibit.category,
            exhibit.technicalDetails || null,
            exhibit.historicalContext || null
          ]
        });
      }
    }

    // Create demo admin user if not exists
    await client.execute({
      sql: `
        INSERT OR IGNORE INTO users (id, name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        'admin',
        'Admin User',
        'admin@example.com',
        'admin123',
        'admin'
      ]
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const db = client;