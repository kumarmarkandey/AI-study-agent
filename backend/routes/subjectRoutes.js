const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [subjects] = await db.promise().query(
      "SELECT id, name, description, created_at FROM subjects WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    res.status(200).json({
      subjects,
    });
  } catch (error) {
    console.error("Fetch subjects error:", error);

    res.status(500).json({
      message: "Unable to fetch subjects.",
    });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Subject name is required.",
      });
    }

    const [result] = await db.promise().query(
      "INSERT INTO subjects (user_id, name, description) VALUES (?, ?, ?)",
      [req.user.id, name, description || null]
    );

    res.status(201).json({
      message: "Subject created successfully!",
      subject: {
        id: result.insertId,
        name,
        description: description || null,
      },
    });
  } catch (error) {
    console.error("Create subject error:", error);

    res.status(500).json({
      message: "Unable to create subject.",
    });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const subjectId = req.params.id;

    const [result] = await db.promise().query(
      "DELETE FROM subjects WHERE id = ? AND user_id = ?",
      [subjectId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    res.status(200).json({
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    console.error("Delete subject error:", error);

    res.status(500).json({
      message: "Unable to delete subject.",
    });
  }
});
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const subjectId = req.params.id;

    const [subjects] = await db.promise().query(
      `SELECT id, name, description, created_at
       FROM subjects
       WHERE id = ? AND user_id = ?`,
      [subjectId, req.user.id]
    );

    if (subjects.length === 0) {
      return res.status(404).json({
        message: "Subject not found.",
      });
    }

    res.status(200).json({
      subject: subjects[0],
    });
  } catch (error) {
    console.error("Fetch subject error:", error);

    res.status(500).json({
      message: "Unable to fetch subject.",
    });
  }
});
module.exports = router;
