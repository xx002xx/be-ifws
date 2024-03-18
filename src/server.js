// File: server.js
const express = require("express");
const bodyParser = require("body-parser");
const verifyToken = require("../middleware/verifyToken");
const app = express();

// Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Atur origin yang diizinkan
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // Atur metode yang diizinkan
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Atur header yang diizinkan
  res.setHeader("Access-Control-Allow-Credentials", true); // Izinkan pengiriman kredensial (cookies, auth headers, dll.)
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Tanggapi permintaan preflight dari browser dengan status OK
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(verifyToken);

// Routes
const akunRoutes = require("../routes/akunRoutes"); // done
const roleRoutes = require("../routes/roleRoutes"); // done

app.use("/akun", akunRoutes);
app.use("/roles", roleRoutes);

// Starting server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
