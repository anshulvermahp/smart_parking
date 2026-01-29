const express = require("express");
const path = require("path");

const app = express();

/* =======================
   View Engine
======================= */
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

/* =======================
   Middlewares
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));
require("dotenv").config();

/* =======================
   Database
======================= */
const ConnectDB = require("./connection/db");
ConnectDB(
  "mongodb+srv://jivanand0526_db_user:M6Ap7fPqxa0sE5GJ@cluster0.rdchg95.mongodb.net/?appName=Cluster0"
);

/* =======================
   Routes
======================= */
const homepage = require("./routes/home");
const register = require("./routes/register");
const login = require("./routes/login");
const mapView = require("./routes/map");
const newParking = require("./routes/newParking");

// Public routes
app.use("/", homepage);
app.use("/", register);
app.use("/", login);
app.use("/", mapView);

// Admin routes
app.use("/admin", newParking);

/* =======================
   Server
======================= */
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
