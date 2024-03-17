// models/roleModel.js

const pool = require("../config/db");

class RoleModel {
  static async createRole(namaRole) {
    try {
      const query = "INSERT INTO role (nm_role) VALUES (?)";
      const result = await pool.query(query, [namaRole]);

      return { success: true, message: "Role created successfully" };
    } catch (error) {
      console.error("Error creating role:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async getAllRoles() {
    try {
      const query = "SELECT * FROM role";
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

  static async getAllRolesData() {
    try {
      const query = "SELECT * FROM role";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      const roles = result;

      if (!roles || roles.length === 0) {
        throw new Error("No roles found in the database");
      }

      const total = roles.length;

      return { total, items: roles };
    } catch (error) {
      console.error("Error getting all roles", error);
      throw new Error("Database error");
    }
  }

  static async getRoleById(idRole) {
    try {
      const query = "SELECT * FROM role where id_role = ?";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [idRole], (error, results, fields) => {
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

  static async updateRole(idRole, namaRole) {
    try {
      const query = "UPDATE role SET nm_role = ? WHERE id_role = ?";
      const result = await pool.query(query, [namaRole, idRole]);

      return { success: true, message: "User updated successfully" };
    } catch (error) {
      console.error("Error updating role", error);
      throw new Error("Database error");
    }
  }

  static async deleteRole(idRole) {
    try {
      const query = "DELETE FROM role WHERE id_role = ?";
      const result = await pool.query(query, [idRole]);

      return { success: true, message: "Role delte successfully" };
    } catch (error) {
      console.error("Error delete role:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async getRoleByName(namaRole) {
    try {
      const query = "SELECT * FROM role where nm_role LIKE ? || '%'";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [namaRole], (error, results, fields) => {
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

module.exports = RoleModel;
