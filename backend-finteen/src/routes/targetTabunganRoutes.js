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
 *             required:
 *               - namaTarget
 *               - nominalTarget
 *               - targetBulan
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c85
 *                 user:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c84
 *                 namaTarget:
 *                   type: string
 *                   example: Beli Laptop
 *                 nominalTarget:
 *                   type: number
 *                   example: 10000000
 *                 tabunganSekarang:
 *                   type: number
 *                   example: 5000000
 *                 targetBulan:
 *                   type: number
 *                   example: 10
 *                 perBulan:
 *                   type: number
 *                   example: 1000000
 *                 status:
 *                   type: string
 *                   enum: [realistis, tidak realistis]
 *                   example: realistis
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data tidak lengkap"
 *       500:
 *         description: Server error
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   namaTarget:
 *                     type: string
 *                   nominalTarget:
 *                     type: number
 *                   tabunganSekarang:
 *                     type: number
 *                   targetBulan:
 *                     type: number
 *                   perBulan:
 *                     type: number
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 namaTarget:
 *                   type: string
 *                 nominalTarget:
 *                   type: number
 *                 tabunganSekarang:
 *                   type: number
 *                 targetBulan:
 *                   type: number
 *                 perBulan:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Target tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Target tidak ditemukan"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Target berhasil diupdate"
 *                 target:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     namaTarget:
 *                       type: string
 *                     nominalTarget:
 *                       type: number
 *                     tabunganSekarang:
 *                       type: number
 *                     targetBulan:
 *                       type: number
 *                     perBulan:
 *                       type: number
 *                     status:
 *                       type: string
 *       404:
 *         description: Target tidak ditemukan
 *       500:
 *         description: Server error
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Target berhasil dihapus"
 *       404:
 *         description: Target tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, targetTabunganController.deleteTarget);


/**
 * @swagger
 * /target-tabungan/{id}/topup:
 *   post:
 *     summary: Tambah tabungan ke target
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
 *             required:
 *               - jumlah
 *             properties:
 *               jumlah:
 *                 type: number
 *                 description: Jumlah uang yang ditambahkan ke tabungan
 *                 example: 500000
 *     responses:
 *       200:
 *         description: Tabungan berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tabungan berhasil ditambahkan"
 *                 target:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     user:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c84"
 *                     namaTarget:
 *                       type: string
 *                       example: "Beli Laptop"
 *                     nominalTarget:
 *                       type: number
 *                       example: 10000000
 *                     tabunganSekarang:
 *                       type: number
 *                       example: 5500000
 *                     targetBulan:
 *                       type: number
 *                       example: 10
 *                     perBulan:
 *                       type: number
 *                       example: 1000000
 *                     status:
 *                       type: string
 *                       enum: [realistis, tidak realistis]
 *                       example: "realistis"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Request tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jumlah harus lebih dari 0"
 *       404:
 *         description: Target tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Target tidak ditemukan"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/:id/topup", authMiddleware, targetTabunganController.topupTarget);

module.exports = router;