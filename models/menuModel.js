// models/menuModel.js

const pool = require("../config/db");

class MenuModel {
  static async createMenu(nmMenu, urlMenu) {
    try {
      const query = "INSERT INTO menu (nm_menu, url_menu) VALUES (?,?)";
      const result = await pool.query(query, [nmMenu, urlMenu]);

      return { success: true, message: "Menu created successfully" };
    } catch (error) {
      console.error("Error creating menu:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async getAllMenus() {
    try {
      const query = "SELECT * FROM menu";
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
      console.error("Error getting all menus:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async getAllMenusData(page, limit, search) {
    try {
      const query = "SELECT COUNT(*) as total FROM menu"; // Hitung total data
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

      const queryData = `SELECT * FROM menu LIMIT ${limit} OFFSET ${offset}`;
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
      console.error("Error getting all menus", error);
      throw new Error("Database error");
    }
  }

  static async getMenuById(idMenu) {
    try {
      const query = "SELECT * FROM menu where id_menu =?";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [idMenu], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error getting menu by ID:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async getMenuByName(nmMenu) {
    try {
      const query = "SELECT * FROM menu where nm_menu LIKE? || '%'";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [nmMenu], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      const menus = result;
      const total = menus.length;
      if (!menus || menus.length === 0) {
        return { total, items: menus };
      }

      return { total, items: menus };
    } catch (error) {
      console.error("Error getting menu by name:", error);
      throw new Error("Data not found");
    }
  }

  static async updateMenu(idMenu, nmMenu, urlMenu) {
    try {
      const query = "UPDATE menu SET nm_menu =?, url_menu =? WHERE id_menu =?";
      const result = await pool.query(query, [nmMenu, urlMenu, idMenu]);

      return { success: true, message: "Menu updated successfully" };
    } catch (error) {
      console.error("Error updating menu", error);
      throw new Error("Database error");
    }
  }

  static async deleteMenu(idMenu) {
    try {
      const query = "DELETE FROM menu WHERE id_menu =?";
      const result = await pool.query(query, [idMenu]);

      return { success: true, message: "Menu deleted successfully" };
    } catch (error) {
      console.error("Error deleting menu:", error);
      throw new Error("Database error: " + error.message);
    }
  }
}

module.exports = MenuModel;
