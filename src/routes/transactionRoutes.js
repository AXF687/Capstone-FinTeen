const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const transactionController = require("../controllers/transactionController");

router.post("/", auth, transactionController.createTransaction);
router.get("/", auth, transactionController.getTransactions);
router.get("/:id", auth, transactionController.getSingleTransaction);
router.put("/:id", auth, transactionController.updateTransaction);
router.delete("/:id", auth, transactionController.deleteTransaction);

module.exports = router;