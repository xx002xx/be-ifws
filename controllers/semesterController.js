// controllers/semesterController.js

const SemesterModel = require("../models/SemesterModel");

class semesterController {
  static async createSemester(req, res) {
    const { tahun_awal, tahun_akhir, semester, tanggal_awal, tanggal_akhir } =
      req.body;
    try {
      const newSemester = await SemesterModel.createSemester(
        tahun_awal,
        tahun_akhir,
        semester,
        tanggal_awal,
        tanggal_akhir
      );
      res.json(newSemester);
    } catch (error) {
      console.error("Error creating Semester", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getAllSemesters(req, res) {
    try {
      const allSemesters = await SemesterModel.getAllSemesters();
      res.json(allSemesters);
    } catch (error) {
      console.error("Error getting all Semesters", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getSemesterByName(req, res) {
    try {
      const id = req.params.id;
      const semester = await SemesterModel.getSemesterById(id);
      if (!semester) {
        return res.status(404).json({ error: "Semester not found" });
      }
      res.json(semester);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllSemestersData(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const semestersData = await SemesterModel.getAllSemestersData(
        page,
        limit
      );

      const total = semestersData.total;
      const items = semestersData.items;

      const totalPages = Math.ceil(total / limit); // Hitung total halaman

      res.status(200).json({ total, totalPages, items });
    } catch (error) {
      console.error("Error getting all Semesters", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getSemesterById(req, res) {
    const idSemester = req.params.id;
    try {
      const semester = await SemesterModel.getSemesterById(idSemester);
      res.json(semester);
    } catch (error) {
      console.error("Error getting Semester by ID", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateSemester(req, res) {
    const idSemester = req.params.id;
    const { tahun_awal, tahun_akhir, semester, tanggal_awal, tanggal_akhir } =
      req.body;
    try {
      const updatedSemester = await SemesterModel.updateSemester(
        idSemester,
        tahun_awal,
        tahun_akhir,
        semester,
        tanggal_awal,
        tanggal_akhir
      );
      res.json(updatedSemester);
    } catch (error) {
      console.error("Error updating Semester", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteSemester(req, res) {
    const idSemester = req.params.id;
    try {
      const deletedSemester = await SemesterModel.deleteSemester(idSemester);
      res.json(deletedSemester);
    } catch (error) {
      console.error("Error deleting Semester", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = semesterController;
