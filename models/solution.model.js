const db = require("../config/db");

class Solucion {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM Soluciones");
    return rows;
  }

  static async getById(id_problema) {
    const [rows] = await db.query(
      "SELECT s.id_solucion, s.descripcion, s.pasos_detallados, s.fecha_creacion FROM Soluciones WHERE s.id_problema = ?",
      [id_problema]
    );

    // Si no encuentra la solucion, devuelve null
    if (rows.length === 0) {
      return null;
    }

    const solucion = rows[0];

    // Obtener las imágenes asociadas a esta solución
    const [imagenes] = await db.query(
      "SELECT nombre_imagen FROM Imagenes_Soluciones WHERE id_solucion = ?",
      [solucion.id_solucion]
    );

    // Retornar la solución junto con las imágenes asociadas
    return {
      ...solucion,
      imagenes: imagenes.map((img) => img.nombre_imagen), // Solo devolvemos el nombre de las imágenes
    };
  }

  static async create(
    id_problema,
    descripcion,
    pasos_detallados,
    imagenes = []
  ) {
    const connection = await db.getConnection(); // Obtener una conexión
    try {
      await connection.beginTransaction(); // Iniciar transacción

      // Insertar la nueva solución
      const [result] = await connection.query(
        "INSERT INTO Soluciones (id_problema, descripcion, pasos_detallados) VALUES (?, ?, ?)",
        [id_problema, descripcion, pasos_detallados]
      );

      const id_solucion = result.insertId;

      // Insertar las imágenes asociadas a la solución
      if (imagenes.length > 0) {
        for (const imagen of imagenes) {
          await connection.query(
            "INSERT INTO Imagenes_Soluciones (id_solucion, nombre_imagen) VALUES (?, ?)",
            [id_solucion, imagen]
          );
        }
      }

      await connection.commit(); // Confirmar la transacción
      return id_solucion;
    } catch (error) {
      await connection.rollback(); // Revertir en caso de error
      console.error("Error al crear la solución: ", error.message);
      throw error;
    } finally {
      connection.release(); // Liberar la conexión
    }
  }

  static async delete(id_solucion) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Eliminar primero las imágenes asociadas a la solución
      await connection.query(
        "DELETE FROM Imagenes_Soluciones WHERE id_solucion = ?",
        [id_solucion]
      );

      // Luego eliminar la solución
      const [result] = await connection.query(
        "DELETE FROM Soluciones WHERE id_solucion = ?",
        [id_solucion]
      );

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      console.error("Error al eliminar la solución: ", error.message);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Solucion;
