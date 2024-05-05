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

      const kegiatanData = await KegiatanModel.getAllKegiatanData(page, limit);

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