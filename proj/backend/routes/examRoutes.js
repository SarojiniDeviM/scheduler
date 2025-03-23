const express = require("express");
const Exam = require("../models/Exam");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Schedule an Exam (POST)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { examName, subject, date, time, duration } = req.body;

    if (!examName || !subject || !date || !time || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate Date Format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Validate Time Format (HH:MM, 24-hour format)
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return res.status(400).json({ message: "Invalid time format. Use HH:MM (24-hour)" });
    }

    const newExam = new Exam({
      userId: req.userId, // Save the user ID from the token
      examName,
      subject,
      date,
      time,
      duration,
    });

    await newExam.save();
    res.status(201).json({ message: "Exam scheduled successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error scheduling exam", error: error.message });
  }
});

// ✅ Get Exams of Logged-in User Only (GET)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.userId }).sort({ date: 1 }); // Sort exams by date (earliest first)
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams", error: error.message });
  }
});

module.exports = router;
