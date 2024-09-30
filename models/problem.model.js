const db = require("../config/db");

class Problema {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM Problemas");
    return rows;
  }

  static async getById(id_problema) {
    // Obtener el problema por su id
    const [rows] = await db.query(
      "SELECT * FROM Problemas WHERE id_problema = ?",
      [id_problema]
    );

    // Si no encuentra el problema, devuelve null
    if (rows.length === 0) {
      return null;
    }

    const problema = rows[0];

    // Obtener las imágenes asociadas a este problema
    const [imagenes] = await db.query(
      "SELECT nombre_imagen FROM Imagenes_Problemas WHERE id_problema = ?",
      [id_problema]
    );

    // Retornar el problema junto con las imágenes asociadas
    return {
      ...problema,
      imagenes: imagenes.map((img) => img.nombre_imagen), // Solo devolvemos los nombres de las imágenes
    };
  }

  static async create(titulo, id_categoria, descripcion, imagenes = []) {
    const connection = await db.getConnection(); // Obtener una conexión
    try {
      await connection.beginTransaction(); // Iniciar transacción

      // Insertar el nuevo problema
      const [result] = await connection.query(
        "INSERT INTO Problemas (titulo, id_categoria, descripcion) VALUES (?, ?, ?)",
        [titulo, id_categoria, descripcion]
      );

      const id_problema = result.insertId;

      // Insertar las imágenes asociadas al problema si existen
      if (imagenes.length > 0) {
        for (const imagen of imagenes) {
          await connection.query(
            "INSERT INTO Imagenes_Problemas (id_problema, nombre_imagen) VALUES (?, ?)",
            [id_problema, imagen]
          );
        }
      }

      await connection.commit(); // Confirmar la transacción
      return id_problema;
    } catch (error) {
      await connection.rollback(); // Revertir en caso de error
      console.error("Error al crear el problema: ", error.message); // Log del error
      throw error;
    } finally {
      connection.release(); // Liberar la conexión
    }
  }

  static async delete(id_problema) {
    const connection = await db.getConnection(); // Obtener una conexión
    try {
      await connection.beginTransaction(); // Iniciar transacción

      // Eliminar primero las imágenes asociadas al problema
      await connection.query(
        "DELETE FROM Imagenes_Problemas WHERE id_problema = ?",
        [id_problema]
      );

      // Luego eliminar el problema
      const [result] = await connection.query(
        "DELETE FROM Problemas WHERE id_problema = ?",
        [id_problema]
      );

      await connection.commit(); // Confirmar la transacción
      return result;
    } catch (error) {
      await connection.rollback(); // Revertir en caso de error
      console.error("Error al eliminar el problema: ", error.message); // Log del error
      throw error;
    } finally {
      connection.release(); // Liberar la conexión
    }
  }
}

module.exports = Problema;
