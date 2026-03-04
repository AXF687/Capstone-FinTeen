const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /transaksi:
 *   post:
 *     summary: Tambah transaksi
 *     tags: [Transaksi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               note:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaksi berhasil dibuat
 */
router.post("/", authMiddleware, transactionController.createTransaction);

/**
 * @swagger
 * /transaksi:
 *   get:
 *     summary: Ambil transaksi user
 *     tags: [Transaksi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bulan
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: tahun
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Daftar transaksi
 */
router.get("/", authMiddleware, transactionController.getTransactions);

module.exports = router;