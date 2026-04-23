const express = require("express");
const router = express.Router();

const {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem,
    searchItems
} = require("../controllers/itemController");

const protect = require("../middleware/authMiddleware");

// PROTECTED ROUTES
router.post("/items", protect, createItem);
router.get("/items", protect, getItems);
router.get("/items/:id", protect, getItemById);
router.put("/items/:id", protect, updateItem);
router.delete("/items/:id", protect, deleteItem);
router.get("/items/search", protect, searchItems);

module.exports = router;