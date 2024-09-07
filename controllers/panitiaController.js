// controllers/panitiaController.js

const PanitiaModel = require("../models/PanitiaModel");

class panitiaController {
  static async createPanitia(req, res) {
    const { nama_panitia, rate_panitia, id_role } = req.body;
    try {
      const newPanitia = await PanitiaModel.createPanitia(
        nama_panitia,
        rate_panitia,
        id_role
      );
      res.json(newPanitia);
    } catch (error) {
      console.error("Error creating Panitia", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async createPesertaTugasAkhir(req, res) {
    if (!req.file) {
      return res.status(400).send({ message: "Tidak ada file yang diunggah." });
    }
    const fileexcel = req.file.filename;
    const filePath = `/uploads/${fileexcel}`;
    try {
      const newPanitia = await PanitiaModel.createPesertaTugasAkhir(
        req.body.id_kegiatan,
        req.body.id_panitia,
        req.body.id_semester,
        filePath // Menggunakan filePath yang sudah dibentuk
      );
      if (!newPanitia) {
        return res.status(404).json({ error: "Data panitia tidak ditemukan" });
      }
      res.json({
        message: "File berhasil diunggah!",
        filePath: filePath,
      });
    } catch (error) {
      console.error("Error creating Panitia", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async createRepository(req, res) {
    if (!req.file) {
      return res.status(400).send({ message: "Tidak ada file yang diunggah." });
    }
    const fileexcel = req.file.filename;
    const filePath = `uploads/${fileexcel}`;
    try {
      const newPanitia = await PanitiaModel.createRepository(
        req.body.id_kegiatan,
        req.body.nama_file,
        req.body.username,
        filePath // Menggunakan filePath yang sudah dibentuk
      );
      if (!newPanitia) {
        return res.status(404).json({ error: "Data panitia tidak ditemukan" });
      }
      res.json({
        message: "File berhasil diunggah!",
        filePath: filePath,
      });
    } catch (error) {
      console.error("Error creating Panitia", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async pesertatugasakhirzoom(req, res) {
    if (!req.file) {
      return res.status(400).send({ message: "Tidak ada file yang diunggah." });
    }
    const fileexcel = req.file.filename;
    const filePath = `/uploads/${fileexcel}`;
    try {
      const newPanitia = await PanitiaModel.pesertatugasakhirzoom(
        req.body.id_kegiatan,
        req.body.id_panitia,
        filePath // Menggunakan filePath yang sudah dibentuk
      );
      if (!newPanitia) {
        return res.status(404).json({ error: "Data panitia tidak ditemukan" });
      }
      res.json({
        message: "File berhasil diunggah!",
        filePath: filePath,
      });
    } catch (error) {
      console.error("Error creating Panitia", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePanitiaDetail(req, res) {
    const idPanitia = req.params.id;
    const { rate_panitia } = req.body;
    try {
      const updatedPanitia = await PanitiaModel.updatePanitiaDetail(
        idPanitia,
        rate_panitia
      );
      res.json(updatedPanitia);
    } catch (error) {
      console.error("Error updating Panitia", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async createPanitiaNarasumber(req, res) {
    const { id_panitia, id_kegiatan } = req.body;
    try {
      const newPanitia = await PanitiaModel.createPanitiaNarasumber(
        id_kegiatan,
        id_panitia
      );
      res.json(newPanitia);
    } catch (error) {
      console.error("Error creating Panitia", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async getAllPanitias(req, res) {
    try {
      const allPanitias = await PanitiaModel.getAllPanitias();
      res.json(allPanitias);
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async getAllPanitiasNarasumber(req, res) {
    try {
      const allPanitias = await PanitiaModel.getAllPanitiasNarasumber();
      res.json(allPanitias);
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async getAllPanitiasNotNarasumber(req, res) {
    try {
      const allPanitias = await PanitiaModel.getAllPanitiasNotNarasumber();
      res.json(allPanitias);
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getPanitiaByName(req, res) {
    try {
      const id = req.params.id;
      const Panitia = await PanitiaModel.getPanitiaByName(id);
      if (!Panitia) {
        return res.status(404).json({ error: "Panitia not found" });
      }
      res.json(Panitia);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllPanitiasData(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || "";

      const PanitiasData = await PanitiaModel.getAllPanitiasData(
        page,
        limit,
        search
      );

      const total = PanitiasData.total;
      const items = PanitiasData.items;

      const totalPages = Math.ceil(total / limit); // Hitung total halaman

      res.status(200).json({ total, totalPages, items });
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllPanitiasDataPeserta(req, res) {
    try {
      const PanitiasData = await PanitiaModel.getAllPanitiasDataPeserta();
      res.json(PanitiasData);
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async getAllPanitiasDataPesertaById(req, res) {
    try {
      const id = req.params.id;
      const PanitiasData = await PanitiaModel.getAllPanitiasDataPesertaById(id);
      res.json(PanitiasData);
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllPanitiasDataReposryById(req, res) {
    try {
      const id = req.params.id;
      const PanitiasData = await PanitiaModel.getAllPanitiasDataReposryById(id);
      res.json(PanitiasData);
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllPanitiasDataDetail(req, res) {
    try {
      const role = req.query.role;
      const id = req.params.id;
      const PanitiasData = await PanitiaModel.getAllPanitiasDataDetail(
        id,
        role
      );

      const items = PanitiasData.items;

      res.status(200).json({ items });
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getPanitiaById(req, res) {
    const idPanitia = req.params.id;
    try {
      const Panitia = await PanitiaModel.getPanitiaById(idPanitia);
      res.json(Panitia);
    } catch (error) {
      console.error("Error getting Panitia by ID", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getAllPanitiasDataKehadiranById(req, res) {
    try {
      const id = req.params.id;
      const PanitiasData = await PanitiaModel.getAllPanitiasDataKehadiranById(
        id
      );
      res.json(PanitiasData);
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updatePanitia(req, res) {
    const idPanitia = req.params.id;
    const { nama_panitia, rate_panitia, id_role } = req.body; // Menghapus status dari objek yang diterima dari permintaan
    try {
      const updatedPanitia = await PanitiaModel.updatePanitia(
        idPanitia,
        nama_panitia,
        rate_panitia,
        id_role
      ); // Menghapus status dari pemanggilan fungsi updatePanitia
      res.json(updatedPanitia);
    } catch (error) {
      console.error("Error updating Panitia", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deletePanitia(req, res) {
    const idPanitia = req.params.id;
    try {
      const deletedPanitia = await PanitiaModel.deletePanitia(idPanitia);
      res.json(deletedPanitia);
    } catch (error) {
      console.error("Error deleting Panitia", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteRepo(req, res) {
    const idRepo = req.params.id;
    try {
      const deletedRepo = await PanitiaModel.deleteRepo(idRepo);
      res.json(deletedRepo);
    } catch (error) {
      console.error("Error deleting Repo", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deletePanitiadetail(req, res) {
    const idPanitia = req.params.id;
    try {
      const deletedPanitia = await PanitiaModel.deletePanitiadetail(idPanitia);
      res.json(deletedPanitia);
    } catch (error) {
      console.error("Error deleting Panitia", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async deletePanitiaDataPeserta(req, res) {
    const idPanitia = req.params.id;
    try {
      const deletedPanitia = await PanitiaModel.deletePanitiaDataPeserta(
        idPanitia
      );
      res.json(deletedPanitia);
    } catch (error) {
      console.error("Error deleting Panitia", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = panitiaController;
