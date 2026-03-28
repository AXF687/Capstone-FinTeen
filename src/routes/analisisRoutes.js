const express = require("express");
const router = express.Router();

const analysisController = require("../controllers/analisaController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: analisis
 *   description: Analisis keuangan dan insight FinTeen
 */

/**
 * @swagger
 * /analisis:
 *   get:
 *     summary: Ambil analisis keuangan user
 *     description: Menghitung total pemasukan, pengeluaran, saldo, distribusi pengeluaran, dan insight otomatis FinTeen.
 *     tags: [analisis]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data analisis berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPemasukan:
 *                   type: number
 *                   example: 5000000
 *                 totalPengeluaran:
 *                   type: number
 *                   example: 3500000
 *                 saldo:
 *                   type: number
 *                   example: 1500000
 *                 distribusi:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       kategori:
 *                         type: string
 *                         example: makan
 *                       total:
 *                         type: number
 *                         example: 1200000
 *                 insights:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Awas! Pengeluaranmu bulan ini sudah mencapai lebih dari 80% pemasukan."
 *                     - "Pengeluaran hiburan kamu cukup tinggi (lebih dari 20% budget)."
 *                     - "Kamu punya sisa uang sekitar Rp500.000. Sisihkan sebagian untuk tabungan."
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, analysisController.getAnalysis);

module.exports = router;