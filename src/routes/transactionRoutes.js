const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Transaksi
 *   description: API untuk mengelola transaksi keuangan
 */


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
 *             required:
 *               - tipe
 *               - nominal
 *               - kategori
 *               - tanggal
 *             properties:
 *               tipe:
 *                 type: string
 *                 enum: [pemasukan, pengeluaran]
 *                 example: pengeluaran
 *               nominal:
 *                 type: number
 *                 example: 50000
 *               kategori:
 *                 type: string
 *                 example: makan
 *               catatan:
 *                 type: string
 *                 example: makan siang
 *               tanggal:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-09
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat
 */
router.post("/", authMiddleware, transactionController.createTransaction);



/**
 * @swagger
 * /transaksi:
 *   get:
 *     summary: Ambil semua transaksi milik user
 *     tags: [Transaksi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar transaksi berhasil diambil
 */
router.get("/", authMiddleware, transactionController.getTransactions);



/**
 * @swagger
 * /transaksi/{id}:
 *   get:
 *     summary: Ambil detail satu transaksi
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
 *         description: Detail transaksi berhasil diambil
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get("/:id", authMiddleware, transactionController.getSingleTransaction);



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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipe:
 *                 type: string
 *                 enum: [pemasukan, pengeluaran]
 *               nominal:
 *                 type: number
 *               kategori:
 *                 type: string
 *               catatan:
 *                 type: string
 *               tanggal:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaksi berhasil diupdate
 *       404:
 *         description: Transaksi tidak ditemukan
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
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);



module.exports = router;