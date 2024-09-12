const db = require('../config/db');

class Tag {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM Tags');
        return rows;
    }

    static async create(nombre, id_problema) {
        const [result] = await db.query('INSERT INTO Tags (nombre, id_problema) VALUES (?, ?)', [nombre, id_problema]);
        return result.insertId;
    }

    static async delete(id_tag) {
        await db.query('DELETE FROM Tags WHERE id_tag = ?', [id_tag]);
    }
}

module.exports = Tag;
