require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const noteRoutes = require("./routes/noteRoutes");
const materialRoutes = require("./routes/materialRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/ai", aiRoutes);

// Home status route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "StudySphere AI 3D Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// Test database connection
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }
  console.log("MySQL database connected successfully!");
});

// Start server locally (skip port binding in Vercel serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`StudySphere AI server running on http://localhost:${PORT}`);
  });
}

module.exports = app;