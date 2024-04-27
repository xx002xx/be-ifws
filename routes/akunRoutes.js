// File: routes/userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/", UserController.getAllUsers);
router.get("/data", UserController.getAllUserData);
router.get("/data/:username", UserController.getUserByUsername);
router.post("/", UserController.createUser);
router.put("/:username", UserController.updateUser);
router.get("/delete/:username", UserController.deleteUser);
router.post("/login", UserController.login);
router.put("/resetpassword/:username", UserController.resetPassword);

module.exports = router;
