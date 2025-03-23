require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware"); // Ensure this file exists

const app = express();
const PORT = process.env.PORT || 5174;
const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

// ===========================
// 🌐 Middleware
// ===========================
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===========================
// 🔗 MongoDB Connection
// ===========================
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/exam_scheduler")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ===========================
// 🔹 User Schema & Authentication Routes
// ===========================
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// 🚀 Signup Route
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Account Created Successfully!" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// 🔐 Login Route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login Successful!", token, userId: user._id });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ===========================
// 📌 Exam Schema & Routes (with Authentication)
// ===========================
const ExamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examName: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: Date, required: true }, // Changed to Date type
  time: { type: String, required: true },
  duration: { type: String, required: true },
});
const Exam = mongoose.model("Exam", ExamSchema);

// ✅ Create an Exam (Only Logged-in Users)
app.post("/api/exams", authMiddleware, async (req, res) => {
  try {
    const { examName, subject, date, time, duration } = req.body;
    if (!examName || !subject || !date || !time || !duration) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newExam = new Exam({ userId: req.userId, examName, subject, date, time, duration });
    await newExam.save();

    res.status(201).json({ message: "Exam scheduled successfully!" });
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// 📌 Get Exams of Logged-in User Only
app.get("/api/exams", authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.userId }); // Fetch only logged-in user's exams
    res.json(exams);
  } catch (error) {
    console.error("Get Exams Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✏️ Update an Exam (Only Logged-in User's Exam)
app.put("/api/exams/:id", authMiddleware, async (req, res) => {
  try {
    const { examName, subject, date, time, duration } = req.body;
    const updatedExam = await Exam.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { examName, subject, date, time, duration },
      { new: true }
    );

    if (!updatedExam) {
      return res.status(404).json({ error: "Exam not found or not authorized" });
    }

    res.json({ message: "Exam updated successfully!" });
  } catch (error) {
    console.error("Update Exam Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ❌ Delete an Exam (Only Logged-in User's Exam)
app.delete("/api/exams/:id", authMiddleware, async (req, res) => {
  try {
    const deletedExam = await Exam.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!deletedExam) {
      return res.status(404).json({ error: "Exam not found or not authorized" });
    }

    res.json({ message: "Exam deleted successfully!" });
  } catch (error) {
    console.error("Delete Exam Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// ===========================
// 🚀 Start Server
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
