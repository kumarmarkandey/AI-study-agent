const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET all study materials for a subject
router.get("/subject/:subjectId", authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const [materials] = await db.promise().query(
      `SELECT id, title, file_url, content_type, summary, created_at
       FROM materials
       WHERE subject_id = ? AND user_id = ?
       ORDER BY created_at DESC`,
      [subjectId, req.user.id]
    );

    res.status(200).json({
      materials,
    });
  } catch (error) {
    console.error("Fetch materials error:", error);
    res.status(500).json({
      message: "Unable to fetch study materials.",
    });
  }
});

// CREATE a study material item
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { subjectId, title, file_url, content_type, summary } = req.body;

    if (!subjectId || !title) {
      return res.status(400).json({
        message: "Subject ID and title are required.",
      });
    }

    // Verify subject ownership
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
      `INSERT INTO materials
       (user_id, subject_id, title, file_url, content_type, summary)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        subjectId,
        title,
        file_url || null,
        content_type || "document",
        summary || null,
      ]
    );

    res.status(201).json({
      message: "Study material added successfully!",
      material: {
        id: result.insertId,
        subjectId,
        title,
        file_url: file_url || null,
        content_type: content_type || "document",
        summary: summary || null,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Create material error:", error);
    res.status(500).json({
      message: "Unable to add study material.",
    });
  }
});

// DELETE a study material item
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.promise().query(
      "DELETE FROM materials WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Material not found.",
      });
    }

    res.status(200).json({
      message: "Study material deleted successfully!",
    });
  } catch (error) {
    console.error("Delete material error:", error);
    res.status(500).json({
      message: "Unable to delete study material.",
    });
  }
});

module.exports = router;
