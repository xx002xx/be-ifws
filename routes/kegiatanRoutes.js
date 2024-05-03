// File: routes/userRoutes.js
const express = require("express");
const router = express.Router();
const kegiatanController = require("../controllers/KegiatanController"); // Mengubah userController menjadi kegiatanController

router.get("/", kegiatanController.getAllKegiatan); // Mengubah userController.getAllUsers menjadi kegiatanController.getAllKegiatan
router.get("/data", kegiatanController.getAllKegiatanData);
router.get("/data/:nama", kegiatanController.getKegiatanByUsername); // Mengubah userController.getUserByUsername menjadi kegiatanController.getKegiatanByUsername
router.post("/", kegiatanController.createKegiatan); // Mengubah userController.createUser menjadi kegiatanController.createKegiatan
router.put("/:id", kegiatanController.updateKegiatan); // Mengubah userController.updateUser menjadi kegiatanController.updateKegiatan
router.get("/delete/:id", kegiatanController.deleteKegiatan); // Mengubah userController.deleteUser menjadi kegiatanController.deleteKegiatan

module.exports = router;
