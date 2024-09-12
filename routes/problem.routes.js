const express = require('express');
const router = express.Router();
const problemaController = require('../controllers/problem.controller');

router.get('/', problemaController.getAllProblemas);
router.post('/', problemaController.createProblema);

module.exports = router;
