const Tag = require("../models/tag.model");

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.getAll();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tags" });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la Tag desde los parámetros de la URL
  try {
    const result = await Tag.getById(id); // Llamamos a la función que elimina la Tag
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tag no encontrado" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al encontrar el Tag:", error);
    res.status(500).json({ message: "Error al encontrar el Tag", error });
  }
};

exports.createTag = async (req, res) => {
  const { nombre, id_problema } = req.body;
  try {
    const newTagId = await Tag.create(nombre, id_problema);
    res.status(201).json({ id: newTagId });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el tag" });
  }
};

exports.deleteTag = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la Tag desde los parámetros de la URL
  try {
    const result = await Tag.delete(id); // Llamamos a la función que elimina la Tag
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tag no encontrado" });
    }
    res.status(200).json({ message: "Tag eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar Tag:", error);
    res.status(500).json({ message: "Error al eliminar Tag", error });
  }
};
