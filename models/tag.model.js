const db = require("../config/db");

class Tag {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM Tags");
    return rows;
  }

  static async getById(id_tag) {
    // Consulta para obtener una categoría por su ID
    const [rows] = await db.query("SELECT * FROM Tags WHERE id_tag = ?", [
      id_tag,
    ]);

    // Si no encuentra la categoría, devuelve null
    if (rows.length === 0) {
      return null;
    }

    return rows[0]; // Devuelve la primera fila (categoría encontrada)
  }

  static async create(nombre, id_problema) {
    const [result] = await db.query(
      "INSERT INTO Tags (nombre, id_problema) VALUES (?, ?)",
      [nombre, id_problema]
    );
    return result.insertId;
  }

  static async delete(id_tag) {
    const [result] = await db.query("DELETE FROM Tags WHERE id_tag = ?", [
      id_tag,
    ]);
    return result;
  }
}

module.exports = Tag;
