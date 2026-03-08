const express = require("express");
const router = express.Router();

const targetTabunganController = require("../controllers/targetTabunganController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Target Tabungan
 *   description: API untuk mengelola target tabungan user
 */

/**
 * @swagger
 * /target-tabungan:
 *   post:
 *     summary: Buat target tabungan
 *     tags: [Target Tabungan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namaTarget:
 *                 type: string
 *                 example: Beli Laptop
 *               nominalTarget:
 *                 type: number
 *                 example: 10000000
 *               targetBulan:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Target tabungan berhasil dibuat
 *       400:
 *         description: Data tidak valid
 */
router.post("/", authMiddleware, targetTabunganController.createTarget);


/**
 * @swagger
 * /target-tabungan:
 *   get:
 *     summary: Ambil semua target tabungan user
 *     tags: [Target Tabungan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar target tabungan
 */
router.get("/", authMiddleware, targetTabunganController.getTargets);


/**
 * @swagger
 * /target-tabungan/{id}:
 *   get:
 *     summary: Ambil detail target tabungan
 *     tags: [Target Tabungan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID target tabungan
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail target tabungan
 *       404:
 *         description: Target tidak ditemukan
 */
router.get("/:id", authMiddleware, targetTabunganController.getTargetById);


/**
 * @swagger
 * /target-tabungan/{id}:
 *   put:
 *     summary: Update target tabungan
 *     tags: [Target Tabungan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID target tabungan
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namaTarget:
 *                 type: string
 *                 example: Beli Motor
 *               nominalTarget:
 *                 type: number
 *                 example: 20000000
 *               targetBulan:
 *                 type: number
 *                 example: 12
 *     responses:
 *       200:
 *         description: Target tabungan berhasil diupdate
 *       404:
 *         description: Target tidak ditemukan
 */
router.put("/:id", authMiddleware, targetTabunganController.updateTarget);


/**
 * @swagger
 * /target-tabungan/{id}:
 *   delete:
 *     summary: Hapus target tabungan
 *     tags: [Target Tabungan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID target tabungan
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Target tabungan berhasil dihapus
 *       404:
 *         description: Target tidak ditemukan
 */
router.delete("/:id", authMiddleware, targetTabunganController.deleteTarget);

module.exports = router;