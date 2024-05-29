// routes/PanitiaRoutes.js
const express = require("express");
const panitiaController = require("../controllers/panitiaController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /xlsx|xls|csv|pdf|doc|docx|ppt|pptx|txt|jpg|jpeg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Error: Only allowed file types are xlsx, xls, csv, pdf, doc, docx, ppt, pptx, and txt!"
        )
      );
    }
  },
});
const uploadSingle = upload.single("file");

router.post("/", panitiaController.createPanitia);
router.post("/narasumber", panitiaController.createPanitiaNarasumber);
router.post(
  "/pesertatugasakhir",
  (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  panitiaController.createPesertaTugasAkhir
);

router.post(
  "/repository",
  (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  panitiaController.createRepository
);

router.post(
  "/pesertatugasakhirzoom",
  (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  panitiaController.pesertatugasakhirzoom
);

router.get("/", panitiaController.getAllPanitias);
router.get("/narasumber", panitiaController.getAllPanitiasNarasumber);
router.get("/notnarasumber", panitiaController.getAllPanitiasNotNarasumber);
router.get("/data/:id", panitiaController.getPanitiaByName);
router.get("/data", panitiaController.getAllPanitiasData);
router.get("/datapeserta", panitiaController.getAllPanitiasDataPeserta);
router.get(
  "/datapesertazoom/:id",
  panitiaController.getAllPanitiasDataPesertaById
);
router.get(
  "/datarepository/:id",
  panitiaController.getAllPanitiasDataReposryById
);

router.get("/detail/:id", panitiaController.getAllPanitiasDataDetail);
router.get(
  "/datakehadiran/:id",
  panitiaController.getAllPanitiasDataKehadiranById
);
router.get("/:id", panitiaController.getPanitiaById);
router.put("/:id", panitiaController.updatePanitia);
router.get("/delete/:id", panitiaController.deletePanitia);
router.get("/deleterepo/:id", panitiaController.deleteRepo);
router.get("/detail/delete/:id", panitiaController.deletePanitiadetail);
router.get("/peserta/delete/:id", panitiaController.deletePanitiaDataPeserta);
router.put("/detail/:id", panitiaController.updatePanitiaDetail);

module.exports = router;
