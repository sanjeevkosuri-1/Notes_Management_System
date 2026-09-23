const express = require("express");

const {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createNote);

router.get("/", authMiddleware, getNotes);

router.get("/:id", authMiddleware, getNote);

router.put("/:id", authMiddleware, updateNote);

router.delete("/:id", authMiddleware, deleteNote);

module.exports = router;