const Note = require("../models/Note");

// CREATE NOTE
const createNote = async (req, res) => {
    try {
        const {
            title,
            category,
            tags,
            content,
            pinned,
            archived
        } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({
                message: "Title, category and content are required"
            });
        }

        const note = await Note.create({
            title,
            category,
            tags: tags || [],
            content,
            pinned: pinned || false,
            archived: archived || false,
            user: req.userId
        });

        res.status(201).json({
            message: "Note created successfully",
            note
        });

    } catch (error) {
        console.log("CREATE ERROR:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL NOTES
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json(notes);

    } catch (error) {
        console.log("GET NOTES ERROR:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SINGLE NOTE
const getNote = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json(note);

    } catch (error) {
        console.log("GET SINGLE NOTE ERROR:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE NOTE
const updateNote = async (req, res) => {
    try {
        const {
            title,
            category,
            tags,
            content,
            pinned,
            archived
        } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({
                message: "Title, category and content are required"
            });
        }

        const note = await Note.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        note.title = title;
        note.category = category;
        note.tags = Array.isArray(tags) ? tags : [];
        note.content = content;

        if (typeof pinned === "boolean") {
            note.pinned = pinned;
        }

        if (typeof archived === "boolean") {
            note.archived = archived;
        }

        await note.save();

        res.status(200).json({
            message: "Note updated successfully",
            note
        });

    } catch (error) {
        console.log("UPDATE ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DELETE NOTE
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {
        console.log("DELETE ERROR:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote
};