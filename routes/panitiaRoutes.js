// routes/PanitiaRoutes.js

const express = require("express");
const panitiaController = require("../controllers/panitiaController");

const router = express.Router();

router.post("/", panitiaController.createPanitia);
router.post("/narasumber", panitiaController.createPanitiaNarasumber);
router.get("/", panitiaController.getAllPanitias);
router.get("/narasumber", panitiaController.getAllPanitiasNarasumber);
router.get("/notnarasumber", panitiaController.getAllPanitiasNotNarasumber);
router.get("/data/:id", panitiaController.getPanitiaByName);
router.get("/data", panitiaController.getAllPanitiasData);
router.get("/detail/:id", panitiaController.getAllPanitiasDataDetail);
router.get("/:id", panitiaController.getPanitiaById);
router.put("/:id", panitiaController.updatePanitia);
router.get("/delete/:id", panitiaController.deletePanitia);
router.get("/detail/delete/:id", panitiaController.deletePanitiadetail);

module.exports = router;
