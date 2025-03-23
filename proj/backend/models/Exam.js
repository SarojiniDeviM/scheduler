const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");
const authMiddleware = require("../middleware/auth"); // Middleware to protect routes

// ✅ Get exams for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user.id }); // Fetch only user's exams
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Create a new exam (only for logged-in users)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { examName, subject, date, time, duration, email } = req.body;

    if (!examName || !subject || !date || !time || !duration || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExam = new Exam({
      examName,
      subject,
      date,
      time,
      duration,
      email,
      userId: req.user.id, // Store the user ID
    });

    const savedExam = await newExam.save();
    res.json(savedExam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update an existing exam (only by the owner)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Check if the logged-in user is the owner of the exam
    if (exam.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update exam details
    exam.examName = req.body.examName || exam.examName;
    exam.subject = req.body.subject || exam.subject;
    exam.date = req.body.date || exam.date;
    exam.time = req.body.time || exam.time;
    exam.duration = req.body.duration || exam.duration;
    exam.email = req.body.email || exam.email;

    const updatedExam = await exam.save();
    res.json(updatedExam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete an exam (only by the owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Check if the logged-in user is the owner of the exam
    if (exam.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await exam.deleteOne();
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
