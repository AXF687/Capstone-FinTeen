const express = require("express");
const router = express.Router();

const hutangController = require("../controllers/hutangController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /hutang:
 *   post:
 *     summary: Hitung dan simpan simulasi cicilan
 *     tags: [Hutang]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalPinjaman:
 *                 type: number
 *                 example: 10000000
 *               bungaTahunan:
 *                 type: number
 *                 example: 12
 *               lamaBulan:
 *                 type: number
 *                 example: 12
 *     responses:
 *       201:
 *         description: Perhitungan cicilan berhasil disimpan
 */
router.post("/", authMiddleware, hutangController.createHutang);

/**
 * @swagger
 * /hutang:
 *   get:
 *     summary: Ambil semua riwayat simulasi cicilan user
 *     tags: [Hutang]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar simulasi cicilan
 */
router.get("/", authMiddleware, hutangController.getHutang);

/**
 * @swagger
 * /hutang/{id}:
 *   get:
 *     summary: Ambil detail simulasi cicilan
 *     tags: [Hutang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID simulasi cicilan
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail simulasi cicilan
 */
router.get("/:id", authMiddleware, hutangController.getHutangById);

/**
 * @swagger
 * /hutang/{id}:
 *   put:
 *     summary: Update simulasi cicilan
 *     tags: [Hutang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID simulasi cicilan
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalPinjaman:
 *                 type: number
 *               bungaTahunan:
 *                 type: number
 *               lamaBulan:
 *                 type: number
 *     responses:
 *       200:
 *         description: Simulasi cicilan berhasil diupdate
 */
router.put("/:id", authMiddleware, hutangController.updateHutang);

/**
 * @swagger
 * /hutang/{id}:
 *   delete:
 *     summary: Hapus riwayat simulasi cicilan
 *     tags: [Hutang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID simulasi cicilan
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Simulasi cicilan berhasil dihapus
 */
router.delete("/:id", authMiddleware, hutangController.deleteHutang);

module.exports = router;