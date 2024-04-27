// routes/PanitiaRoutes.js

const express = require("express");
const semesterController = require("../controllers/semesterController");

const router = express.Router();

router.post("/", semesterController.createSemester);
router.get("/", semesterController.getAllSemesters);
router.get("/data/:id", semesterController.getSemesterByName);
router.get("/data", semesterController.getAllSemestersData);
router.get("/:id", semesterController.getSemesterById);
router.put("/:id", semesterController.updateSemester);
router.get("/delete/:id", semesterController.deleteSemester);

module.exports = router;
