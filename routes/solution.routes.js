const express = require('express');
const router = express.Router();
const solucionController = require('../controllers/solution.controller');

router.get('/', solucionController.getAllSoluciones);
router.post('/', solucionController.createSolucion);

module.exports = router;
