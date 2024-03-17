// routes/roleRoutes.js

const express = require("express");
const RoleController = require("../controllers/roleController");

const router = express.Router();

router.post("/", RoleController.createRole);
router.get("/", RoleController.getAllRoles);
router.get("/data/:id", RoleController.getRoleByName);
router.get("/data", RoleController.getAllRolesData);
router.get("/:id", RoleController.getRoleById);
router.put("/:id", RoleController.updateRole);
router.get("/delete/:id", RoleController.deleteRole);

module.exports = router;
