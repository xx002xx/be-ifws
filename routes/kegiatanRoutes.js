// File: routes/userRoutes.js
const express = require("express");
const router = express.Router();
const kegiatanController = require("../controllers/KegiatanController"); // Mengubah userController menjadi kegiatanController

router.get("/", kegiatanController.getAllKegiatan); // Mengubah userController.getAllUsers menjadi kegiatanController.getAllKegiatan
router.get("/data", kegiatanController.getAllKegiatanData);
router.get("/kegiatannarsum", kegiatanController.getKegiatanNarsumData);

router.get("/kegiatanpeserta", kegiatanController.getKegiatanPeserta);

router.get("/data/:nama", kegiatanController.getKegiatanByUsername); // Mengubah userController.getUserByUsername menjadi kegiatanController.getKegiatanByUsername
router.post("/", kegiatanController.createKegiatan);
router.post("/laporan", kegiatanController.createLaporan);
router.get(
  "/download/:id_kegiatan/:id_panitia",
  kegiatanController.downloadKegiatan
);

router.get("/laporan/pdf/:id", kegiatanController.generatePdf);
router.get("/kirimemail/:id", kegiatanController.kirimEmailById);
router.put("/:id", kegiatanController.updateKegiatan); // Mengubah userController.updateUser menjadi kegiatanController.updateKegiatan
router.get("/delete/:id", kegiatanController.deleteKegiatan); // Mengubah userController.deleteUser menjadi kegiatanController.deleteKegiatan

module.exports = router;
