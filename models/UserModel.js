// File: models/UserModel.js
const pool = require("../config/db");
const sha1 = require("crypto-js/sha1");
// ganti tb_role dengan role dan tb_user dengan akun

class UserModel {
  static async getAllUsers() {
    try {
      const client = await pool.connect();
      const result =
        await client.query(`SELECT tb_user.username, tb_user.nama, tb_user.email, tb_role.nama_role, tb_role.id_role, tb_user.status
      FROM tb_user
      JOIN tb_role ON tb_user.id_role = tb_role.id_role`);
      client.release();

      const users = result.rows;
      const total = users.length;

      return { total, items: users };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getUserByUsername(username) {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM tb_user WHERE username like $1 || '%'",
        [username]
      );
      client.release();
      const user = result.rows[0]; // Ambil baris pertama dari hasil query

      // Ubah format menjadi objek dengan properti 'total' dan 'items'
      const formattedResult = {
        total: result.rowCount, // Jumlah total baris yang ditemukan
        items: user ? [user] : [], // Jika user ditemukan, masukkan ke dalam array, jika tidak, buat array kosong
      };

      return formattedResult;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findByUsernameAndPassword(username, password) {
    const hashedPassword = sha1(password).toString();

    try {
      // Query untuk mendapatkan informasi pengguna berdasarkan username dan password
      const query = "SELECT * FROM akun WHERE username = ? AND password = ?";
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
      const { username, password, nama, email_akun, last_login, id_role } =
        userData;
      const hashedPassword = sha1(password).toString(); // Hash password menggunakan SHA1

      // Periksa apakah username sudah ada
      const insertQuery =
        "INSERT INTO akun (username, password, nama, email_akun, last_login, id_role) VALUES (?, ?, ?, ?, ?, ?)";
      const result = await pool.query(insertQuery, [
        username,
        hashedPassword,
        nama,
        email_akun,
        last_login,
        id_role,
      ]);

      // Jika eksekusi kueri berhasil tanpa ada kesalahan, kembalikan objek sukses
      if (result) {
        return { success: true, message: "Data berhasil ditambahkan" };
      } else {
        // Jika rowCount 0, ini menunjukkan bahwa tidak ada baris yang berhasil dimasukkan
        return { success: false, message: "Gagal menambahkan data" };
      }
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
      const client = await pool.connect();
      const { nama, password, email, id_role, status } = userData;
      const hashedPassword = sha1(password).toString();
      let query = "UPDATE tb_user SET";
      const values = [];
      if (nama) {
        query += ` nama = $1,`;
        values.push(nama);
      }
      if (email) {
        query += ` email = $2,`;
        values.push(email);
      }
      if (id_role) {
        query += ` id_role = $3,`;
        values.push(id_role);
      }
      if (status) {
        query += ` status = $4,`;
        values.push(status);
      }
      query = query.slice(0, -1); // Remove trailing comma
      query += ` WHERE username = $${values.length + 1} RETURNING *`;
      values.push(username);

      const result = await client.query(query, values);
      client.release();

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
      const client = await pool.connect();
      const result = await client.query(
        "DELETE FROM tb_user WHERE username = $1",
        [username]
      );
      client.release();
      return { statusCode: 200, message: "User berhasil dihapus" };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserModel;
