const Problema = require('../models/problem.model');

exports.getAllProblemas = async (req, res) => {
    try {
        const problemas = await Problema.getAll();
        res.status(200).json(problemas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los problemas' });
    }
};

exports.createProblema = async (req, res) => {
    const { titulo, id_categoria, descripcion } = req.body;
    try {
        const newProblemaId = await Problema.create(titulo, id_categoria, descripcion);
        res.status(201).json({ id: newProblemaId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el problema' });
    }
};
