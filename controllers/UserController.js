// File: controllers/UserController.js
const UserModel = require("../models/UserModel");

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserByUsername(req, res) {
    try {
      const username = req.params.username;
      const user = await UserModel.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllUserData(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const PanitiasData = await UserModel.getAllUserData(page, limit);

      const total = PanitiasData.total;
      const items = PanitiasData.items;

      const totalPages = Math.ceil(total / limit); // Hitung total halaman

      res.status(200).json({ total, totalPages, items });
    } catch (error) {
      console.error("Error getting all Panitias", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await UserModel.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const username = req.params.username;
      const userData = req.body;
      const updatedUser = await UserModel.updateUser(username, userData);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { username } = req.params;
      const newPassword = "dishub.jabar24!#"; // Fungsi untuk menghasilkan password baru

      // Lakukan proses reset password di sini, misalnya menggunakan method model User
      const updatedUser = await UserModel.resetPassword(username, newPassword);

      // Respon jika berhasil
      res.json(updatedUser);
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async deleteUser(req, res) {
    const idPanitia = req.params.username;
    try {
      const deletedPanitia = await UserModel.deleteUser(idPanitia);
      res.json(deletedPanitia);
    } catch (error) {
      console.error("Error deleting Panitia", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;

    try {
      // Memeriksa kredensial pengguna menggunakan UserModel
      const user = await UserModel.findByUsernameAndPassword(
        username,
        password
      );

      console.log(user);

      if (user.length > 0) {
        const userData = user[0]; // Mengambil elemen pertama dari array
        const key = generateRandomString(15);
        res.json({
          code: 200,
          message: "Login successful",
          key: key,
          username: user[0].username,
          nama: user[0].nama,
          email: user[0].email_akun,
          id_role: user[0].id_role,
        });
        console.log(userData); // Ini adalah objek data user
        // Lakukan operasi lain dengan data pengguna di sini
      } else {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      // Jika tidak ada pengguna dengan kredensial yang diberikan, kirim respons error

      // Jika autentikasi berhasil, buat token JWT

      // Menyertakan respon untuk nama dan email pengguna
    } catch (error) {
      console.error("Error executing login", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

module.exports = UserController;
