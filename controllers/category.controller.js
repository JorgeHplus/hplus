const Categoria = require("../models/category.model");

exports.getAllCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.getAll();
    res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ message: "Error al obtener las categorías", error });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la categoría desde los parámetros de la URL
  try {
    const result = await Categoria.getById(id); // Llamamos a la función que elimina la categoría
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al encontrar la categoría:", error);
    res.status(500).json({ message: "Error al encontrar la categoría", error });
  }
};

exports.createCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const newCategoriaId = await Categoria.create(nombre, descripcion);
    res.status(201).json({ id: newCategoriaId });
  } catch (error) {
    console.error("Error al crear la categoría:", error); // Mostrar más detalles en la consola
    res.status(500).json({ message: "Error al crear la categoría", error });
  }
};

exports.deleteCategoria = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la categoría desde los parámetros de la URL
  try {
    const result = await Categoria.delete(id); // Llamamos a la función que elimina la categoría
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).json({ message: "Error al eliminar la categoría", error });
  }
};
