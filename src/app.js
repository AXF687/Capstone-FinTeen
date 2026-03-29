const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const hutangRoutes = require("./routes/hutangRoutes");
const targetTabunganRoutes = require("./routes/targetTabunganRoutes");
const analisisRoutes = require("./routes/analisisRoutes");

// Swagger
const swaggerUi = require("swagger-ui-express");
const specs = require("./config/swagger");

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// ==================== DATABASE ====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("Mongo Error ❌:", err));

// ==================== ROUTES ====================
app.get("/", (req, res) => {
  res.send("API jalan bro 🚀");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transaksi", transactionRoutes);
app.use("/api/hutang", hutangRoutes);
app.use("/api/target-tabungan", targetTabunganRoutes);
app.use("/api/analisis", analisisRoutes);

// ==================== SERVER ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
