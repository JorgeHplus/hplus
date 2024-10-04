const Problema = require("../models/problem.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../public/img"); // Ruta del directorio de destino
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Crea la carpeta si no existe
    }
    cb(null, dir); // Guardar el archivo en 'public/img'
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Usar el nombre original del archivo
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
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

const upload = multer({ storage: storage }).array("imagenes", 5); // Permitir subir hasta 5 imágenes

exports.getAllProblemas = async (req, res) => {
  try {
    const problemas = await Problema.getAll();
    res.status(200).json(problemas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los problemas" });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la Problema desde los parámetros de la URL
  try {
    const result = await Problema.getById(id); // Llamamos a la función que elimina la Problema
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Problema no encontrado" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al encontrar el Problema:", error);
    res.status(500).json({ message: "Error al encontrar el Problema", error });
  }
};

exports.createProblema = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: "Error al subir las imágenes", error: err.message });
    } else if (err) {
      return res.status(400).json({
        message: "Error inesperado al subir las imágenes",
        error: err.message,
      });
    }

    const { titulo, id_categoria, descripcion } = req.body;

    // Extraemos las rutas de las imágenes subidas
    const imagenes = req.files ? req.files.map((file) => file.path) : [];

    try {
      const newProblemaId = await Problema.create(
        titulo,
        id_categoria,
        descripcion,
        imagenes
      );
      res.status(201).json({ id: newProblemaId });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al crear el problema", error: error.message });
    }
  });
};

exports.deleteProblema = async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener las imágenes asociadas al problema antes de eliminarlo
    const problema = await Problema.getById(id);
    if (!problema) {
      return res.status(404).json({ message: "Problema no encontrado" });
    }

    // Eliminar el problema y las imágenes de la base de datos
    const result = await Problema.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Problema no encontrado" });
    }

    // Eliminar las imágenes del sistema de archivos
    if (problema.imagenes && problema.imagenes.length > 0) {
      problema.imagenes.forEach((imagen) => {
        const imagePath = path.join(imagen);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error al eliminar la imagen:", err);
          }
        });
      });
    }

    res.status(200).json({ message: "Problema eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar problema: ", error);
    res.status(500).json({ message: "Error al eliminar problema", error });
  }
};
