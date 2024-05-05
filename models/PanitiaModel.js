// models/PanitiaModel.js

const pool = require("../config/db");

class PanitiaModel {
  static async createPanitia(nama_panitia, rate_panitia, id_role) {
    try {
      const query =
        "INSERT INTO panitia (nama_panitia, rate_panitia, id_role) VALUES (?, ?, ?)";
      const result = await pool.query(query, [
        nama_panitia,
        rate_panitia,
        id_role,
      ]);
      console.log(result);
      return { success: true, message: "Panitia created successfully" };
    } catch (error) {
      console.error("Error creating Panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async createPanitiaNarasumber(id_kegiatan, id_panitia) {
    try {
      const query =
        "INSERT INTO detail_panitia (id_kegiatan, id_panitia) VALUES (?, ?)";
      const result = await pool.query(query, [id_kegiatan, id_panitia]);
      console.log(result);
      return { success: true, message: "Panitia created successfully" };
    } catch (error) {
      console.error("Error creating Panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async getAllPanitias() {
    try {
      const query =
        "SELECT a.*, b.nm_role FROM panitia a JOIN role b ON a.id_role = b.id_role";
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

  static async getAllPanitiasNarasumber() {
    try {
      const query = `SELECT a.*, b.nm_role 
FROM panitia a 
JOIN role b ON a.id_role = b.id_role 
WHERE b.nm_role LIKE '%Narasumber%'`;
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
  static async getAllPanitiasNotNarasumber() {
    try {
      const query = `SELECT a.*, b.nm_role 
FROM panitia a 
JOIN role b ON a.id_role = b.id_role 
WHERE b.nm_role NOT LIKE '%Narasumber%'`;
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

  static async getAllPanitiasData(page, limit) {
    try {
      const query = "SELECT COUNT(*) as total FROM panitia"; // Hitung total data
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

      const queryData = `SELECT a.*, b.nm_role
      FROM panitia a
      JOIN role b ON a.id_role = b.id_role LIMIT ${limit} OFFSET ${offset}`;
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

  static async getAllPanitiasDataDetail(id, role) {
    try {
      let queryData = "";
      let queryParams = [id];
      if (role == "Narasumber") {
        queryData = `SELECT a.*, b.nama_panitia, c.nm_role
                   FROM detail_panitia a
                   JOIN panitia b ON a.id_panitia = b.id_panitia
                   JOIN role c ON b.id_role = c.id_role
                   WHERE a.id_kegiatan = ? AND c.nm_role LIKE ?`;
        queryParams.push(`%${role}%`);
      } else {
        queryData = `SELECT a.*, b.nama_panitia, c.nm_role
                   FROM detail_panitia a
                   JOIN panitia b ON a.id_panitia = b.id_panitia
                   JOIN role c ON b.id_role = c.id_role
                   WHERE a.id_kegiatan = ? AND c.nm_role NOT LIKE ?`;
        queryParams.push("%Narasumber%");
      }
      const dataResult = await new Promise((resolve, reject) => {
        pool.query(queryData, queryParams, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      return { items: dataResult };
    } catch (error) {
      console.error("Error getting all roles", error);
      throw new Error("Database error");
    }
  }

  static async getPanitiaById(idPanitia) {
    try {
      const query = "SELECT * FROM panitia where id_panitia = ?";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [idPanitia], (error, results, fields) => {
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

  static async updatePanitia(idPanitia, nama_panitia, rate_panitia, id_role) {
    try {
      const query =
        "UPDATE panitia SET nama_panitia = ?, rate_panitia = ?, id_role = ? WHERE id_panitia = ?";
      const result = await pool.query(query, [
        nama_panitia,
        rate_panitia,
        id_role,
        idPanitia,
      ]);

      return { success: true, message: "Panitia updated successfully" };
    } catch (error) {
      console.error("Error updating Panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async deletePanitia(idPanitia) {
    try {
      const query = "DELETE FROM panitia WHERE id_panitia = ?";
      const result = await pool.query(query, [idPanitia]);

      return { success: true, message: "Panitia delte successfully" };
    } catch (error) {
      console.error("Error delete panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async deletePanitiadetail(idPanitia) {
    try {
      const query = "DELETE FROM detail_panitia WHERE id_detail_panitia = ?";
      const result = await pool.query(query, [idPanitia]);

      return { success: true, message: "Panitia delte successfully" };
    } catch (error) {
      console.error("Error delete panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }
  static async getPanitiaByName(namaPanitia) {
    try {
      const query = "SELECT * FROM panitia where nama_panitia LIKE ? || '%'";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [namaPanitia], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      const roles = result;
      const total = roles.length;
      if (!roles || roles.length === 0) {
        return { total, items: roles };
      }

      return { total, items: roles };
    } catch (error) {
      console.error("Error getting all roles", error);
      throw new Error("Data not found");
    }
  }
}

module.exports = PanitiaModel;
