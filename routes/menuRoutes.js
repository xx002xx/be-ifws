// routes/roleRoutes.js

const express = require("express");
const MenuController = require("../controllers/menuController");

const router = express.Router();

router.post("/", MenuController.createMenu);
router.get("/", MenuController.fetchAllMenus);
router.get("/data/:id", MenuController.getMenuByName);
router.get("/dataakses/:id", MenuController.getMenuByidROle);
router.get("/data", MenuController.fetchAllMenusData);
router.get("/:id", MenuController.getMenuById);
router.put("/:id", MenuController.updateMenu);
router.get("/delete/:id", MenuController.deleteMenu);

module.exports = router;
