const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/category.controller');

router.get('/', categoriaController.getAllCategorias);
router.post('/', categoriaController.createCategoria);
router.delete('/:id', categoriaController.deleteCategoria)

module.exports = router;
