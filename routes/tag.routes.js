const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag.controller");

router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getById);
router.post("/", tagController.createTag);
router.delete("/:id", tagController.deleteTag);

module.exports = router;
