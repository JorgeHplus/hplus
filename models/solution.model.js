const db = require('../config/db');

class Solucion {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM Soluciones');
        return rows;
    }

    static async create(id_problema, descripcion, pasos_detallados, imagen_url) {
        const [result] = await db.query(
            'INSERT INTO Soluciones (id_problema, descripcion, pasos_detallados, imagen_url) VALUES (?, ?, ?, ?)',
            [id_problema, descripcion, pasos_detallados, imagen_url]
        );
        return result.insertId;
    }

    static async delete(id_solucion) {
        await db.query('DELETE FROM Soluciones WHERE id_solucion = ?', [id_solucion]);
    }
}

module.exports = Solucion;
