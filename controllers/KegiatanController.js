const KegiatanModel = require("../models/KegiatanModel");

class KegiatanController {
  static async getAllKegiatan(req, res) {
    try {
      const kegiatan = await KegiatanModel.getAllKegiatan();
      res.json(kegiatan);
    } catch (error) {
      console.error("Error getting all Kegiatan", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getKegiatanByUsername(req, res) {
    try {
      const { nama } = req.params;
      const kegiatan = await KegiatanModel.getKegiatanByNama(nama);
      if (!kegiatan) {
        return res.status(404).json({ error: "Kegiatan not found" });
      }
      res.json(kegiatan);
    } catch (error) {
      console.error("Error getting Kegiatan by username", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllKegiatanData(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || "";

      const kegiatanData = await KegiatanModel.getAllKegiatanData(
        page,
        limit,
        search
      );

      const { total, items } = kegiatanData;

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({ total, totalPages, items });
    } catch (error) {
      console.error("Error getting all Kegiatan data", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getKegiatanNarsumData(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || "";
      const id_panitia = req.query.id_panitia;

      const kegiatanData = await KegiatanModel.getKegiatanNarsumData(
        page,
        limit,
        search,
        id_panitia
      );

      const { total, items } = kegiatanData;

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({ total, totalPages, items });
    } catch (error) {
      console.error("Error getting all Kegiatan data", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getKegiatanPeserta(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || "";
      const id_peserta = req.query.id_peserta;

      const kegiatanData = await KegiatanModel.getKegiatanPeserta(
        page,
        limit,
        search,
        id_peserta
      );

      const { total, items } = kegiatanData;

      const totalPages = Math.ceil(total / limit);

      res.status(200).json({ total, totalPages, items });
    } catch (error) {
      console.error("Error getting all Kegiatan data", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async createKegiatan(req, res) {
    try {
      const kegiatanData = req.body;
      const newKegiatan = await KegiatanModel.createKegiatan(kegiatanData);
      res.status(201).json(newKegiatan);
    } catch (error) {
      console.error("Error creating Kegiatan", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createLaporan(req, res) {
    try {
      const laporanData = req.body;
      const newLaporan = await KegiatanModel.createLaporan(laporanData);
      res.status(201).json(newLaporan);
    } catch (error) {
      console.error("Error creating Laporan", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async downloadKegiatan(req, res) {
    const { id_kegiatan, id_panitia } = req.params;
    const file = await KegiatanModel.downloadKegiatan(id_kegiatan, id_panitia);
    if (file) {
      console.log(file); // Munculkan hasil pdf di console
      res.json(file);
    } else {
      res.status(404).json({ error: "PDF not found" });
    }
  }

  static async generatePdf(req, res) {
    const { id } = req.params;
    const pdf = await KegiatanModel.generatePdf(id);
    if (pdf) {
      console.log(pdf); // Munculkan hasil pdf di console
      res.json(pdf);
    } else {
      res.status(404).json({ error: "PDF not found" });
    }
  }

  static async kirimEmailById(req, res) {
    const { id } = req.params;
    const email = await KegiatanModel.kirimEmailById(id);
    if (email) {
      res.json(email);
    } else {
      res.status(404).json({ error: "Email not found" });
    }
  }

  static async updateKegiatan(req, res) {
    const idKegiatan = req.params.id;
    const {
      judul_topik,
      link_webinar,
      tanggal_kegiatan,
      waktu_mulai,
      waktu_selesai,
      id_semester,
    } = req.body;
    try {
      const updatedKegiatan = await KegiatanModel.updateKegiatan(
        idKegiatan,
        judul_topik,
        link_webinar,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
        id_semester
      );
      res.json(updatedKegiatan);
    } catch (error) {
      console.error("Error updating Kegiatan", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteKegiatan(req, res) {
    const { id } = req.params;
    try {
      const deletedKegiatan = await KegiatanModel.deleteKegiatan(id);
      res.json(deletedKegiatan);
    } catch (error) {
      console.error("Error deleting Kegiatan", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = KegiatanController;
