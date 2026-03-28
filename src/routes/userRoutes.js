const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manajemen profil user
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Mendapatkan profil user yang sedang login
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil user berhasil diambil
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, getProfile);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update profil user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pelajar, mahasiswa, pekerja, lainnya]
 *                 example: mahasiswa
 *               pemasukan_bulanan:
 *                 type: number
 *                 example: 2000000
 *               target_bulanan:
 *                 type: number
 *                 example: 500000
 *               goal_utama:
 *                 type: string
 *                 example: Beli laptop baru
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Unauthorized
 */
router.put("/me", authMiddleware, updateProfile);
router.put("/me/password", authMiddleware, changePassword);

module.exports = router;