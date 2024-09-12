const db = require('../config/db');

class Categoria {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM Categorias');
        return rows;
    }

    static async create(nombre, descripcion) {
        const [result] = await db.query('INSERT INTO Categorias (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
        return result.insertId;
    }

    static async delete(id_categoria) {
        // Ejecuta la consulta DELETE
        const [result] = await db.query('DELETE FROM Categorias WHERE id_categoria = ?', [id_categoria]);
        return result; // Devuelve el resultado de la operación
    }
}

module.exports = Categoria;
