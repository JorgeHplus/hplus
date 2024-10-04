const Solucion = require("../models/solution.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directorio donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Tipo de archivo no permitido. Solo se permiten imágenes jpeg, jpg, o png."
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB como tamaño máximo para las imágenes
  fileFilter: fileFilter,
}).array("imagenes", 5); // Permitir hasta 5 imágenes

exports.getAllSoluciones = async (req, res) => {
  try {
    const soluciones = await Solucion.getAll();
    res.status(200).json(soluciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las soluciones" });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la Solucion desde los parámetros de la URL
  try {
    const result = await Solucion.getById(id); // Llamamos a la función que elimina la Solucion
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Solucion no encontrada" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al encontrar la Solucion:", error);
    res.status(500).json({ message: "Error al encontrar la Solucion", error });
  }
};

exports.createSolucion = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: "Error al subir las imágenes", error: err.message });
    } else if (err) {
      return res
        .status(400)
        .json({
          message: "Error inesperado al subir las imágenes",
          error: err.message,
        });
    }

    const { id_problema, descripcion, pasos_detallados } = req.body;

    // Extraemos las rutas de las imágenes subidas
    const imagenes = req.files ? req.files.map((file) => file.path) : [];

    try {
      const newSolucionId = await Solucion.create(
        id_problema,
        descripcion,
        pasos_detallados,
        imagenes
      );
      res.status(201).json({ id: newSolucionId });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al crear la solución", error: error.message });
    }
  });
};
exports.deleteSolucion = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener las imágenes asociadas a la solución antes de eliminarla
    const solucion = await Solucion.getById(id);
    if (!solucion) {
      return res.status(404).json({ message: "Solución no encontrada" });
    }

    // Eliminar la solución y las imágenes de la base de datos
    const result = await Solucion.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Solución no encontrada" });
    }

    // Eliminar las imágenes del sistema de archivos
    if (solucion.imagenes && solucion.imagenes.length > 0) {
      solucion.imagenes.forEach((imagen) => {
        const imagePath = path.join(__dirname, "../", imagen);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error al eliminar la imagen:", err);
          }
        });
      });
    }

    res.status(200).json({ message: "Solución eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la solución: ", error);
    res.status(500).json({ message: "Error al eliminar la solución", error });
  }
};
