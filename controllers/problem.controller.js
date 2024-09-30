const Problema = require("../models/problem.model");

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

exports.createProblema = async (req, res) => {
  const { titulo, id_categoria, descripcion } = req.body;
  try {
    const newProblemaId = await Problema.create(
      titulo,
      id_categoria,
      descripcion
    );
    res.status(201).json({ id: newProblemaId });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el problema" });
  }
};

exports.deleteProblema = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Problema.delete(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Problema no encontrado" });
    }
    res.status(200).json({ message: "Problema eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar problema: ", error);
    res.status(500).json({ message: "Error al eliminar problema: ", error });
  }
};
