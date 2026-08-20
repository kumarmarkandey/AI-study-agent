const express = require("express");
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Helper to simulate AI intelligent breakdown based on study content or subject topic
function generateAIExplanation(topic, userQuestion, contextNotes) {
  const combinedContext = contextNotes ? contextNotes.map(n => `${n.title}: ${n.content}`).join("\n") : "";
  return `Here is an in-depth explanation tailored to your query about **${topic || "your subject"}**:

${userQuestion ? `**Q:** ${userQuestion}\n\n` : ""}**Core Concept Breakdown:**
- **Key Principle:** ${topic || "The subject matter"} revolves around foundational structures, relationships, and analytical principles.
- **Application:** When reviewing your notes${contextNotes && contextNotes.length > 0 ? ` (such as *${contextNotes[0].title}*)` : ""}, focus on connecting key terminology with practical problem-solving.
- **Summary:** Practice active recall by self-testing on definitions and key steps.

${combinedContext ? `*Context analyzed from your ${contextNotes.length} note(s).*` : ""}`;
}

// ----------------------------------------------------
// 1. AI CHAT ASSISTANT
// ----------------------------------------------------

// POST /api/ai/chat - Send message to AI Study Assistant
router.post("/chat", authenticateToken, async (req, res) => {
  try {
    const { subjectId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    let subjectName = "General Study";
    let notes = [];

    if (subjectId) {
      const [subjects] = await db.promise().query(
        "SELECT name FROM subjects WHERE id = ? AND user_id = ?",
        [subjectId, req.user.id]
      );
      if (subjects.length > 0) {
        subjectName = subjects[0].name;
      }

      const [notesData] = await db.promise().query(
        "SELECT title, content FROM notes WHERE subject_id = ? AND user_id = ? LIMIT 3",
        [subjectId, req.user.id]
      );
      notes = notesData;
    }

    const aiResponse = generateAIExplanation(subjectName, message, notes);

    // Save chat interaction to database
    const [result] = await db.promise().query(
      "INSERT INTO ai_chats (user_id, subject_id, message, response) VALUES (?, ?, ?, ?)",
      [req.user.id, subjectId || null, message, aiResponse]
    );

    res.status(200).json({
      chat: {
        id: result.insertId,
        subjectId: subjectId || null,
        message,
        response: aiResponse,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ message: "AI Assistant failed to generate response." });
  }
});

// GET /api/ai/chat/:subjectId - Get past chat history
router.get("/chat/:subjectId", authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const [chats] = await db.promise().query(
      "SELECT id, message, response, created_at FROM ai_chats WHERE subject_id = ? AND user_id = ? ORDER BY created_at ASC",
      [subjectId, req.user.id]
    );

    res.status(200).json({ chats });
  } catch (error) {
    console.error("Fetch chat history error:", error);
    res.status(500).json({ message: "Unable to load chat history." });
  }
});

// ----------------------------------------------------
// 2. QUIZ GENERATOR & ENGINE
// ----------------------------------------------------

// POST /api/ai/quiz/generate - Generate & save a quiz to DB
router.post("/quiz/generate", authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.body;

    if (!subjectId) {
      return res.status(400).json({ message: "Subject ID is required." });
    }

    // Get subject details & notes
    const [subjects] = await db.promise().query(
      "SELECT name FROM subjects WHERE id = ? AND user_id = ?",
      [subjectId, req.user.id]
    );

    if (subjects.length === 0) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const subjectName = subjects[0].name;

    const [notes] = await db.promise().query(
      "SELECT title, content FROM notes WHERE subject_id = ? AND user_id = ?",
      [subjectId, req.user.id]
    );

    // Create quiz record
    const quizTitle = `${subjectName} Assessment - ${new Date().toLocaleDateString()}`;
    const [quizResult] = await db.promise().query(
      "INSERT INTO quizzes (user_id, subject_id, title, total_questions) VALUES (?, ?, ?, ?)",
      [req.user.id, subjectId, quizTitle, 4]
    );

    const quizId = quizResult.insertId;

    // Default sample questions based on subject content or template
    const sampleQuestions = [
      {
        question: `What is the primary objective when studying ${subjectName}?`,
        option_a: `Memorizing formulas without application`,
        option_b: `Understanding core principles, terminology, and practical applications`,
        option_c: `Skipping foundational concepts to read conclusions`,
        option_d: `Only reading titles`,
        correct_option: "B",
        explanation: `Mastering ${subjectName} relies on building a solid understanding of core principles.`,
      },
      {
        question: `How does active recall improve learning retention in ${subjectName}?`,
        option_a: `It tests your memory directly to strengthen neural pathways`,
        option_b: `It causes passive fatigue`,
        option_c: `It eliminates the need for notes`,
        option_d: `It replaces practice problem solving`,
        correct_option: "A",
        explanation: `Active recall forces the brain to retrieve information, building stronger retention.`,
      },
      {
        question: `Which technique is recommended for organizing notes in ${subjectName}?`,
        option_a: `Structuring content with clear headings, summaries, and key terms`,
        option_b: `Writing paragraphs without spacing or titles`,
        option_c: `Never reviewing previously recorded notes`,
        option_d: `Deleting notes immediately after reading`,
        correct_option: "A",
        explanation: `Structured notes allow faster review and better concept linking.`,
      },
      {
        question: notes.length > 0 ? `Based on your note "${notes[0].title}", what is a key focus area?` : `What is an effective strategy for preparing for exams in ${subjectName}?`,
        option_a: `Consistent daily practice and quiz testing`,
        option_b: `Cramming 10 minutes before the test`,
        option_c: `Ignoring past mistakes on quizzes`,
        option_d: `Only studying topics you already know`,
        correct_option: "A",
        explanation: `Spaced repetition and practice testing are proven to deliver top academic performance.`,
      },
    ];

    for (const q of sampleQuestions) {
      await db.promise().query(
        `INSERT INTO quiz_questions 
         (quiz_id, question, option_a, option_b, option_c, option_d, correct_option, explanation)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quizId,
          q.question,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_option,
          q.explanation,
        ]
      );
    }

    res.status(201).json({
      message: "Quiz generated successfully!",
      quizId,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ message: "Unable to generate quiz." });
  }
});

// GET /api/ai/quizzes/:subjectId - Get all quizzes for subject
router.get("/quizzes/:subjectId", authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const [quizzes] = await db.promise().query(
      `SELECT id, title, score, total_questions, completed, created_at
       FROM quizzes
       WHERE subject_id = ? AND user_id = ?
       ORDER BY created_at DESC`,
      [subjectId, req.user.id]
    );

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Fetch quizzes error:", error);
    res.status(500).json({ message: "Unable to fetch quizzes." });
  }
});

// GET /api/ai/quiz/questions/:quizId - Get questions for a specific quiz
router.get("/quiz/questions/:quizId", authenticateToken, async (req, res) => {
  try {
    const { quizId } = req.params;

    const [questions] = await db.promise().query(
      `SELECT id, question, option_a, option_b, option_c, option_d, correct_option, explanation
       FROM quiz_questions
       WHERE quiz_id = ?`,
      [quizId]
    );

    res.status(200).json({ questions });
  } catch (error) {
    console.error("Fetch quiz questions error:", error);
    res.status(500).json({ message: "Unable to load quiz questions." });
  }
});

// POST /api/ai/quiz/submit - Submit quiz results & update score in DB
router.post("/quiz/submit", authenticateToken, async (req, res) => {
  try {
    const { quizId, score, totalQuestions } = req.body;

    await db.promise().query(
      `UPDATE quizzes SET score = ?, total_questions = ?, completed = 1 WHERE id = ? AND user_id = ?`,
      [score, totalQuestions, quizId, req.user.id]
    );

    res.status(200).json({ message: "Quiz score recorded successfully!" });
  } catch (error) {
    console.error("Quiz submit error:", error);
    res.status(500).json({ message: "Unable to record quiz score." });
  }
});

// ----------------------------------------------------
// 3. FLASHCARD GENERATOR & ENGINE
// ----------------------------------------------------

// POST /api/ai/flashcards/generate - Generate & save flashcards to DB
router.post("/flashcards/generate", authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.body;

    if (!subjectId) {
      return res.status(400).json({ message: "Subject ID is required." });
    }

    const [subjects] = await db.promise().query(
      "SELECT name FROM subjects WHERE id = ? AND user_id = ?",
      [subjectId, req.user.id]
    );

    if (subjects.length === 0) {
      return res.status(404).json({ message: "Subject not found." });
    }

    const subjectName = subjects[0].name;

    const [notes] = await db.promise().query(
      "SELECT title, content FROM notes WHERE subject_id = ? AND user_id = ?",
      [subjectId, req.user.id]
    );

    const generatedCards = [
      {
        front: `What is the core definition of ${subjectName}?`,
        back: `${subjectName} involves systematic study, problem solving, and conceptual comprehension.`,
      },
      {
        front: `Why is spaced repetition vital for ${subjectName}?`,
        back: `Spaced repetition optimizes long-term memory retention by reviewing material right before forgetting occurs.`,
      },
      {
        front: notes.length > 0 ? `Key Concept from Note: ${notes[0].title}` : `How to master key concepts in ${subjectName}?`,
        back: notes.length > 0 ? notes[0].content.slice(0, 150) + "..." : `Break down complex topics into smaller sub-units and test yourself regularly.`,
      },
      {
        front: `What is the Feynman Technique?`,
        back: `A learning method where you explain a concept in simple terms as if teaching a beginner.`,
      },
    ];

    for (const card of generatedCards) {
      await db.promise().query(
        "INSERT INTO flashcards (user_id, subject_id, front, back) VALUES (?, ?, ?, ?)",
        [req.user.id, subjectId, card.front, card.back]
      );
    }

    res.status(201).json({ message: "Flashcards generated successfully!" });
  } catch (error) {
    console.error("Flashcards generation error:", error);
    res.status(500).json({ message: "Unable to generate flashcards." });
  }
});

// GET /api/ai/flashcards/:subjectId - Get flashcards for subject
router.get("/flashcards/:subjectId", authenticateToken, async (req, res) => {
  try {
    const { subjectId } = req.params;

    const [flashcards] = await db.promise().query(
      "SELECT id, front, back, is_mastered, created_at FROM flashcards WHERE subject_id = ? AND user_id = ? ORDER BY created_at DESC",
      [subjectId, req.user.id]
    );

    res.status(200).json({ flashcards });
  } catch (error) {
    console.error("Fetch flashcards error:", error);
    res.status(500).json({ message: "Unable to fetch flashcards." });
  }
});

// PUT /api/ai/flashcards/:id/master - Toggle flashcard mastery status
router.put("/flashcards/:id/master", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { isMastered } = req.body;

    await db.promise().query(
      "UPDATE flashcards SET is_mastered = ? WHERE id = ? AND user_id = ?",
      [isMastered ? 1 : 0, id, req.user.id]
    );

    res.status(200).json({ message: "Flashcard updated!" });
  } catch (error) {
    console.error("Flashcard mastery error:", error);
    res.status(500).json({ message: "Unable to update flashcard." });
  }
});

// DELETE /api/ai/flashcards/:id - Delete a flashcard
router.delete("/flashcards/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.promise().query(
      "DELETE FROM flashcards WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    res.status(200).json({ message: "Flashcard deleted!" });
  } catch (error) {
    console.error("Delete flashcard error:", error);
    res.status(500).json({ message: "Unable to delete flashcard." });
  }
});

// ----------------------------------------------------
// 4. OVERALL PROGRESS & STATS METRICS
// ----------------------------------------------------

// GET /api/ai/progress/stats - Live dashboard statistics from DB
router.get("/progress/stats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [subjectCount] = await db.promise().query(
      "SELECT COUNT(*) as total FROM subjects WHERE user_id = ?",
      [userId]
    );

    const [noteCount] = await db.promise().query(
      "SELECT COUNT(*) as total FROM notes WHERE user_id = ?",
      [userId]
    );

    const [quizCount] = await db.promise().query(
      "SELECT COUNT(*) as total, AVG(score) as avgScore FROM quizzes WHERE user_id = ? AND completed = 1",
      [userId]
    );

    const [flashcardCount] = await db.promise().query(
      "SELECT COUNT(*) as total, SUM(CASE WHEN is_mastered = 1 THEN 1 ELSE 0 END) as mastered FROM flashcards WHERE user_id = ?",
      [userId]
    );

    res.status(200).json({
      stats: {
        totalSubjects: subjectCount[0].total || 0,
        totalNotes: noteCount[0].total || 0,
        totalQuizzes: quizCount[0].total || 0,
        avgQuizScore: Math.round(quizCount[0].avgScore || 0),
        totalFlashcards: flashcardCount[0].total || 0,
        masteredFlashcards: flashcardCount[0].mastered || 0,
      },
    });
  } catch (error) {
    console.error("Progress stats error:", error);
    res.status(500).json({ message: "Unable to fetch progress statistics." });
  }
});

module.exports = router;
