const express = require("express");
const router = express.Router();
const solucionController = require("../controllers/solution.controller");

router.get("/", solucionController.getAllSoluciones);
router.get("/:id", solucionController.getById);
router.post("/", solucionController.createSolucion);
router.delete("/:id", solucionController.deleteSolucion);

module.exports = router;
