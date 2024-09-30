const express = require("express");
const router = express.Router();
const problemaController = require("../controllers/problem.controller");

router.get("/", problemaController.getAllProblemas);
router.get("/:id", problemaController.getById);
router.post("/", problemaController.createProblema);
router.delete("/:id", problemaController.deleteProblema);

module.exports = router;
