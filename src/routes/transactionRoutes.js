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

/**
 * @swagger
 * /transaksi/{id}:
 *   put:
 *     summary: Edit transaksi
 *     tags: [Transaksi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               note:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaksi berhasil diupdate
 */
router.put("/:id", authMiddleware, transactionController.updateTransaction);

/**
 * @swagger
 * /transaksi/{id}:
 *   delete:
 *     summary: Hapus transaksi
 *     tags: [Transaksi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 */
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);

module.exports = router;
