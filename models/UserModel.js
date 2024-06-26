// File: models/UserModel.js
const pool = require("../config/db");
const sha1 = require("crypto-js/sha1");
// ganti tb_role dengan role dan tb_user dengan akun

class UserModel {
  static async getAllUsers() {
    try {
      const client = await pool.connect();
      const result = await client.query(`SELECT a.*, b.nm_role
      FROM akun a
      JOIN role b ON a.id_role = b.id_role`);
      client.release();

      const users = result.rows;
      const total = users.length;

      return { total, items: users };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllUserData(page, limit, search) {
    try {
      let query = "SELECT COUNT(*) as total FROM akun"; // Hitung total data
      if (search) {
        query += ` WHERE username LIKE '%${search}%'`;
      }
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

      let queryData = `SELECT a.*, b.nm_role
      FROM akun a
      JOIN role b ON a.id_role = b.id_role`;
      if (search) {
        queryData += ` WHERE a.username LIKE '%${search}%'`;
      }
      queryData += ` LIMIT ${limit} OFFSET ${offset}`;
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

  static async getUserByUsername(username) {
    try {
      const query = "SELECT * FROM akun where username = ?";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [username], (error, results, fields) => {
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

  static async findByUsernameAndPassword(username, password) {
    const hashedPassword = sha1(password).toString();

    try {
      // Query untuk mendapatkan informasi pengguna berdasarkan username dan password
      const query =
        "SELECT a.*, b.nm_role FROM akun a JOIN role b ON a.id_role = b.id_role WHERE a.username = ? AND a.password = ?";
      const result = await new Promise((resolve, reject) => {
        pool.query(
          query,
          [username, hashedPassword],
          (error, results, fields) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      return result;
    } catch (error) {
      console.error("Error executing query", error);
      throw new Error("Database error");
    }
  }

  static async createUser(userData) {
    try {
      const {
        username,
        password,
        nama,
        email_akun,
        last_login,
        id_role,
        id_panitia,
        id_peserta,
      } = userData;
      const hashedPassword = sha1(password).toString(); // Hash password menggunakan SHA1
      console.log(userData);
      // Periksa apakah username sudah ada
      const insertQuery =
        "INSERT INTO akun (username, password, nama, email_akun, last_login, id_role, id_panitia, id_peserta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const result = await pool.query(insertQuery, [
        username || null,
        hashedPassword || null,
        nama || null,
        email_akun || null,
        last_login || null,
        id_role || null,
        id_panitia || null,
        id_peserta || null,
      ]);
      console.log(result);
      console.log("Last executed query:", insertQuery);
      console.log("Values to be inserted:", {
        username,
        hashedPassword,
        nama,
        email_akun,
        last_login,
        id_role,
        id_panitia,
        id_peserta,
      });

      // Jika eksekusi kueri berhasil tanpa ada kesalahan, kembalikan objek gagal
      return { success: true, message: "Role created successfully" };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        // Handle kesalahan duplikat di sini
        return {
          success: false,
          message: "Username atau email sudah digunakan",
        };
      } else {
        throw new Error(error.message);
      }
    }
  }

  static async updateUser(username, userData) {
    try {
      const { nama, password, email, id_role } = userData;
      const hashedPassword = sha1(password).toString();
      let query = "UPDATE akun SET";
      const values = [];
      let index = 1;

      if (nama) {
        query += ` nama = $${index++},`;
        values.push(nama);
      }
      if (email) {
        query += ` email_akun = $${index++},`;
        values.push(email);
      }
      if (id_role) {
        query += ` id_role = $${index++},`;
        values.push(id_role);
      }

      if (password) {
        query += ` password = $${index++},`;
        values.push(hashedPassword);
      }

      query = query.slice(0, -1); // Remove trailing comma
      query += ` WHERE username = $${index} `;
      values.push(username);

      const result = await pool.query(query, values);
      console.log(result);
      console.log(query);

      if (result.rowCount > 0) {
        return { success: true, message: "User updated successfully" };
      } else {
        return {
          success: false,
          message: "User not found or no changes were made",
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async resetPassword(username, userData) {
    try {
      const client = await pool.connect();
      const password = userData;
      const hashedPassword = sha1(password).toString();
      let query = "UPDATE tb_user SET";
      const values = [];
      if (password !== "") {
        query += ` password = $1,`;
        values.push(hashedPassword);
      }
      query = query.slice(0, -1); // Remove trailing comma
      query += ` WHERE username = $${values.length + 1} RETURNING *`;
      values.push(username);

      const result = await client.query(query, values);
      client.release();

      if (result.rowCount > 0) {
        return { success: true, message: "User reset password successfully" };
      } else {
        return {
          success: false,
          message: "User not found or no changes were made",
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteUser(username) {
    try {
      const query = "DELETE FROM akun WHERE username = ?";
      const result = await pool.query(query, [username]);

      return { success: true, message: "akun delete successfully" };
    } catch (error) {
      console.error("Error delete akun:", error);
      throw new Error("Database error: " + error.message);
    }
  }
}

module.exports = UserModel;
