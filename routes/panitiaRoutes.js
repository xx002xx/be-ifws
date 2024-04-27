// routes/PanitiaRoutes.js

const express = require("express");
const panitiaController = require("../controllers/panitiaController");

const router = express.Router();

router.post("/", panitiaController.createPanitia);
router.get("/", panitiaController.getAllPanitias);
router.get("/data/:id", panitiaController.getPanitiaByName);
router.get("/data", panitiaController.getAllPanitiasData);
router.get("/:id", panitiaController.getPanitiaById);
router.put("/:id", panitiaController.updatePanitia);
router.get("/delete/:id", panitiaController.deletePanitia);

module.exports = router;
