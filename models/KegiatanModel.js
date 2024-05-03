const pool = require("../config/db");

class KegiatanModel {
  static async getAllKegiatan() {
    try {
      const query = `
      SELECT k.*, s.semester, s.tahun_awal, s.tahun_akhir
      FROM kegiatan k
      JOIN semester s ON k.id_semester = s.id_semester
    `;
      const result = await new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error getting all roles:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async getAllKegiatanData(page, limit) {
    try {
      const query = "SELECT COUNT(*) as total FROM kegiatan"; // Hitung total data
      const countResult = await new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].total);
          }
        });
      });

      const total = countResult;
      const offset = (page - 1) * limit;

      const queryData = `
        SELECT k.*, s.semester, s.tahun_awal, s.tahun_akhir
        FROM kegiatan k
        JOIN semester s ON k.id_semester = s.id_semester
        LIMIT ${limit} OFFSET ${offset}
      `;
      const dataResult = await new Promise((resolve, reject) => {
        pool.query(queryData, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      return { total, items: dataResult };
    } catch (error) {
      console.error("Error getting all Kegiatan", error);
      throw new Error("Database error");
    }
  }

  static async getKegiatanByNama(nama) {
    try {
      const query = "SELECT * FROM kegiatan WHERE nama = ?";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [nama], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error getting kegiatan by nama:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async createKegiatan(kegiatanData) {
    try {
      const {
        id_semester,
        judul_topik,
        link_webinar,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
      } = kegiatanData;

      const query = `
      INSERT INTO kegiatan (id_semester, judul_topik, link_webinar, tanggal_kegiatan, waktu_mulai, waktu_selesai)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

      const result = await pool.query(query, [
        id_semester,
        judul_topik,
        link_webinar,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
      ]);

      // Jika eksekusi kueri berhasil tanpa ada kesalahan, kembalikan objek sukses
      if (result) {
        return { success: true, message: "Data kegiatan berhasil ditambahkan" };
      } else {
        // Jika affectedRows 0, ini menunjukkan bahwa tidak ada baris yang berhasil dimasukkan
        return { success: false, message: "Gagal menambahkan data kegiatan" };
      }
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        // Handle kesalahan duplikat di sini
        return {
          success: false,
          message: "Gagal menambahkan data kegiatan: Duplikat entri",
        };
      } else {
        throw new Error(error.message);
      }
    }
  }

  static async updateKegiatan(
    id_kegiatan,
    judul_topik,
    link_webinar,
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai,
    id_semester
  ) {
    try {
      const query =
        "UPDATE kegiatan SET judul_topik = ?, link_webinar = ?, tanggal_kegiatan = ?, waktu_mulai = ?, waktu_selesai = ?, id_semester = ? WHERE id_kegiatan = ?";
      const result = await pool.query(query, [
        judul_topik,
        link_webinar,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
        id_semester,
        id_kegiatan,
      ]);
      return { success: true, message: "Semester updated successfully" };
    } catch (error) {
      console.error("Error updating Kegiatan:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async deleteKegiatan(id) {
    try {
      const query = "DELETE FROM kegiatan WHERE id_kegiatan = ?";
      const result = await pool.query(query, [id]);
      return { success: true, message: "Semester deleted successfully" };
    } catch (error) {
      console.error("Error deleting Semester:", error);
      throw new Error("Database error: " + error.message);
    }
  }
}

module.exports = KegiatanModel;
