const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET all notes for a subject
router.get("/subject/:subjectId", authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const [notes] = await db.promise().query(
      `SELECT id, title, content, created_at, updated_at
       FROM notes
       WHERE subject_id = ? AND user_id = ?
       ORDER BY updated_at DESC`,
      [subjectId, req.user.id]
    );

    res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error("Fetch notes error:", error);
    res.status(500).json({
      message: "Unable to fetch notes.",
    });
  }
});

// CREATE a note
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { subjectId, title, content } = req.body;

    if (!subjectId || !title || !content) {
      return res.status(400).json({
        message: "Subject, title and content are required.",
      });
    }

    // Make sure the subject belongs to the logged-in user
    const [subjects] = await db.promise().query(
      "SELECT id FROM subjects WHERE id = ? AND user_id = ?",
      [subjectId, req.user.id]
    );

    if (subjects.length === 0) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    const [result] = await db.promise().query(
      `INSERT INTO notes
       (user_id, subject_id, title, content)
       VALUES (?, ?, ?, ?)`,
      [req.user.id, subjectId, title, content]
    );

    res.status(201).json({
      message: "Note created successfully!",
      note: {
        id: result.insertId,
        subjectId,
        title,
        content,
      },
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      message: "Unable to create note.",
    });
  }
});

// UPDATE a note
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required.",
      });
    }

    const [result] = await db.promise().query(
      `UPDATE notes
       SET title = ?, content = ?
       WHERE id = ? AND user_id = ?`,
      [title, content, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    res.status(200).json({
      message: "Note updated successfully!",
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      message: "Unable to update note.",
    });
  }
});

// DELETE a note
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      "DELETE FROM notes WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully!",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      message: "Unable to delete note.",
    });
  }
});

module.exports = router;
