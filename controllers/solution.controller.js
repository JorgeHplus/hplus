const Solucion = require('../models/solution.model');

exports.getAllSoluciones = async (req, res) => {
    try {
        const soluciones = await Solucion.getAll();
        res.status(200).json(soluciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las soluciones' });
    }
};

exports.createSolucion = async (req, res) => {
    const { id_problema, descripcion, pasos_detallados, imagen_url } = req.body;
    try {
        const newSolucionId = await Solucion.create(id_problema, descripcion, pasos_detallados, imagen_url);
        res.status(201).json({ id: newSolucionId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la solución' });
    }
};
