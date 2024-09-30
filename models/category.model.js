const db = require("../config/db");

class Categoria {
  static async getAll() {
    const [rows] = await db.query(
      "SELECT c.nombre, c.descripcion, c.fecha_creacion FROM Categorias c"
    );
    return rows;
  }

  static async getById(id_categoria) {
    // Consulta para obtener una categoría por su ID
    const [rows] = await db.query(
      "SELECT c.nombre, c.descripcion, c.fecha_creacion FROM Categorias c WHERE id_categoria = ?",
      [id_categoria]
    );

    // Si no encuentra la categoría, devuelve null
    if (rows.length === 0) {
      return null;
    }

    return rows[0]; // Devuelve la primera fila (categoría encontrada)
  }

  static async create(nombre, descripcion) {
    const [result] = await db.query(
      "INSERT INTO Categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );
    return result.insertId;
  }

  static async delete(id_categoria) {
    // Ejecuta la consulta DELETE
    const [result] = await db.query(
      "DELETE FROM Categorias WHERE id_categoria = ?",
      [id_categoria]
    );
    return result; // Devuelve el resultado de la operación
  }
}

module.exports = Categoria;
