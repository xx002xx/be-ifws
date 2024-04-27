const pool = require("../config/db");

class SemesterModel {
  static async createSemester(
    tahun_awal,
    tahun_akhir,
    semester,
    tanggal_awal,
    tanggal_akhir
  ) {
    try {
      const query =
        "INSERT INTO semester (tahun_awal, tahun_akhir, semester, tanggal_awal, tanggal_akhir) VALUES (?, ?, ?, ?, ?)";
      const result = await pool.query(query, [
        tahun_awal,
        tahun_akhir,
        semester,
        tanggal_awal,
        tanggal_akhir,
      ]);
      console.log(result);
      return { success: true, message: "Semester created successfully" };
    } catch (error) {
      console.error("Error creating Semester:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async getAllSemesters() {
    try {
      const query = "SELECT * FROM semester";
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

  static async getAllSemestersData(page, limit) {
    try {
      const query = "SELECT COUNT(*) as total FROM semester"; // Hitung total data
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

      const queryData = `SELECT a.*
      FROM semester a LIMIT ${limit} OFFSET ${offset}`;
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
      console.error("Error getting all roles", error);
      throw new Error("Database error");
    }
  }

  static async getSemesterById(idSemester) {
    try {
      const query = "SELECT * FROM semester where id_semester = ?";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [idSemester], (error, results, fields) => {
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

  static async updateSemester(
    idSemester,
    tahun_awal,
    tahun_akhir,
    semester,
    tanggal_awal,
    tanggal_akhir
  ) {
    try {
      const query =
        "UPDATE semester SET tahun_awal = ?, tahun_akhir = ?, semester = ?, tanggal_awal = ?, tanggal_akhir = ? WHERE id_semester = ?";
      const result = await pool.query(query, [
        tahun_awal,
        tahun_akhir,
        semester,
        tanggal_awal,
        tanggal_akhir,
        idSemester,
      ]);
      return { success: true, message: "Semester updated successfully" };
    } catch (error) {
      console.error("Error updating Semester:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async deleteSemester(idSemester) {
    try {
      const query = "DELETE FROM semester WHERE id_semester = ?";
      const result = await pool.query(query, [idSemester]);
      return { success: true, message: "Semester deleted successfully" };
    } catch (error) {
      console.error("Error deleting Semester:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async getSemesterByName(namaSemester) {
    try {
      const query = "SELECT * FROM semester WHERE semester LIKE ?";
      const result = await pool.query(query, [`%${namaSemester}%`]);
      const formattedResult = result.map((row) => ({ ...row })); // Membuat salinan objek tanpa sirkularitas
      return { total: formattedResult.length, items: formattedResult };
    } catch (error) {
      console.error("Error getting Semester by name:", error);
      throw new Error("Database error: " + error.message);
    }
  }
}

module.exports = SemesterModel;
