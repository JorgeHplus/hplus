const Tag = require('../models/tag.model');

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.getAll();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tags' });
    }
};

exports.createTag = async (req, res) => {
    const { nombre, id_problema } = req.body;
    try {
        const newTagId = await Tag.create(nombre, id_problema);
        res.status(201).json({ id: newTagId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el tag' });
    }
};
