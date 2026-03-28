const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const hutangRoutes = require("./routes/hutangRoutes");
const targetTabunganRoutes = require("./routes/targetTabunganRoutes");
const analisisRoutes = require("./routes/analisisRoutes");
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // 🌟 Ambil dari .env
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transaksi", transactionRoutes);
app.use("/api/hutang", hutangRoutes);
app.use("/api/target-tabungan", targetTabunganRoutes);
app.use("/api/analisis", analisisRoutes);

module.exports = app;