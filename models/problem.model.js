const db = require('../config/db');

class Problema {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM Problemas');
        return rows;
    }

    static async create(titulo, id_categoria, descripcion) {
        const [result] = await db.query(
            'INSERT INTO Problemas (titulo, id_categoria, descripcion) VALUES (?, ?, ?)',
            [titulo, id_categoria, descripcion]
        );
        return result.insertId;
    }

    static async delete(id_problema) {
        await db.query('DELETE FROM Problemas WHERE id_problema = ?', [id_problema]);
    }
}

module.exports = Problema;
