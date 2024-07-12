import sqlite, { Database } from "sqlite3";
sqlite.verbose()

const db = new Database('bot.db')

db.serialize(() => {
    db.run(`--sql 
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        jid TEXT,
        name TEXT,
        points INTEGER,
        tier TEXT,
        credit INTEGER
    )`)
})

export const addUser = () => {
    const stmt = db.prepare(`INSERT INTO users(id, jid, name, points, tier, credit) VALUES(?, ?, ?, ?, ?, ?)`);
    stmt.run(id, jid, name, points, tier, credit, (err => {
        if (err) {
            throw new Error(`Terjadi Kesalahan : ${err}`)
        } else {
            return 'User berhasil ditambahkan'
        }
    }));
    stmt.finalize();

}
export const getUser = (id, callback) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error(err);
            callback(null);
        } else {
            callback(row);
        }
    });

}
