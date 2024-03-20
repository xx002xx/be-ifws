// controllers/roleController.js

const RoleModel = require("../models/roleModel");

class RoleController {
  static async createRole(req, res) {
    const { namaRole } = req.body; // Menghilangkan status dari objek yang diterima dari permintaan
    try {
      const newRole = await RoleModel.createRole(namaRole); // Menghapus status dari pemanggilan fungsi createRole
      res.json(newRole);
    } catch (error) {
      console.error("Error creating role", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getAllRoles(req, res) {
    try {
      const allRoles = await RoleModel.getAllRoles();
      res.json(allRoles);
    } catch (error) {
      console.error("Error getting all roles", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getRoleByName(req, res) {
    try {
      const id = req.params.id;
      const role = await RoleModel.getRoleByName(id);
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllRolesData(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const rolesData = await RoleModel.getAllRolesData(page, limit);

      const total = rolesData.total;
      const items = rolesData.items;

      const totalPages = Math.ceil(total / limit); // Hitung total halaman

      res.status(200).json({ total, totalPages, items });
    } catch (error) {
      console.error("Error getting all roles", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getRoleById(req, res) {
    const idRole = req.params.id;
    try {
      const role = await RoleModel.getRoleById(idRole);
      res.json(role);
    } catch (error) {
      console.error("Error getting role by ID", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateRole(req, res) {
    const idRole = req.params.id;
    const { namaRole } = req.body; // Menghapus status dari objek yang diterima dari permintaan
    try {
      const updatedRole = await RoleModel.updateRole(idRole, namaRole); // Menghapus status dari pemanggilan fungsi updateRole
      res.json(updatedRole);
    } catch (error) {
      console.error("Error updating role", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteRole(req, res) {
    const idRole = req.params.id;
    try {
      const deletedRole = await RoleModel.deleteRole(idRole);
      res.json(deletedRole);
    } catch (error) {
      console.error("Error deleting role", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = RoleController;
