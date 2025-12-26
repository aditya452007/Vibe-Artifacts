import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'audit.db')

// Initialize DB if not exists
let db: Database.Database | null = null

export function getDb() {
    if (db) return db

    try {
        const dbDir = path.dirname(DB_PATH)
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true })
        }

        db = new Database(DB_PATH)
        db.pragma('journal_mode = WAL')

        // Create tables
        db.exec(`
            CREATE TABLE IF NOT EXISTS interaction_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                provider TEXT,
                model TEXT,
                prompt_length INTEGER,
                response_length INTEGER,
                status TEXT
            );

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `)

        return db
    } catch (error) {
        console.error("Failed to initialize SQLite DB:", error)
        return null
    }
}

export function logInteraction(data: { provider: string, model: string, promptLength: number, responseLength: number, status: 'success' | 'error' }) {
    const database = getDb()
    if (!database) return

    try {
        const stmt = database.prepare(`
            INSERT INTO interaction_logs (provider, model, prompt_length, response_length, status)
            VALUES (?, ?, ?, ?, ?)
        `)
        stmt.run(data.provider, data.model, data.promptLength, data.responseLength, data.status)
    } catch (err) {
        console.error("Failed to log interaction:", err)
    }
}
