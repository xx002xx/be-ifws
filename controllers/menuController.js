// controllers/menuController.js
const MenuModel = require("../models/menuModel");

class MenuController {
  static async createMenu(req, res) {
    const { nmMenu, urlMenu } = req.body;
    try {
      const newMenu = await MenuModel.createMenu(nmMenu, urlMenu);
      res.json(newMenu);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  static async fetchAllMenus(req, res) {
    try {
      const allMenus = await MenuModel.fetchAllMenus();
      res.json(allMenus);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  static async getMenuByName(req, res) {
    const idMenu = req.params.id;
    try {
      const menu = await MenuModel.getMenuByName(idMenu);
      if (!menu) {
        return res.status(404).json({ error: "Menu not found" });
      }
      res.json(menu);
    } catch (error) {
      this.handleError(res, error);
    }
  }
  static async getMenuByidROle(req, res) {
    const idMenu = req.params.id;
    try {
      const menu = await MenuModel.getMenuByidROle(idMenu);
      if (!menu) {
        return res.status(404).json({ error: "Menu not found" });
      }
      res.json(menu);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  static async fetchAllMenusData(req, res) {
    const page = parseInt(req.query.offset) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search;

    try {
      const menusData = await MenuModel.getAllMenusData(page, limit, search);
      const total = menusData.total;
      const items = menusData.items;
      const totalPages = Math.ceil(total / limit);

      res.status(200).json({ total, totalPages, items });
    } catch (error) {
      console.error(res, error);
    }
  }

  static async getMenuById(req, res) {
    const idMenu = req.params.id;
    try {
      const menu = await MenuModel.getMenuById(idMenu);
      res.json(menu);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  static async updateMenu(req, res) {
    const idMenu = req.params.id;
    const { nmMenu, urlMenu } = req.body;
    try {
      const updatedMenu = await MenuModel.updateMenu(idMenu, nmMenu, urlMenu);
      res.json(updatedMenu);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  static async deleteMenu(req, res) {
    const idMenu = req.params.id;
    try {
      const deletedMenu = await MenuModel.deleteMenu(idMenu);
      res.json(deletedMenu);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = MenuController;
