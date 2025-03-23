import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [exams, setExams] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    examName: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    email: "",
  });

  // Fetch exams from MongoDB
  const fetchExams = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/exams", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add authentication if needed
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch exams: ${response.statusText}`);
      }

      const data = await response.json();
      setExams(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching exams:", error);
      setError("Failed to fetch exams. Please check your connection or authentication.");
      setExams([]); // Ensure exams is always an array
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(() =>
        exams.reduce((acc, exam, index) => {
          acc[index] = getTimeRemaining(exam.date, exam.time);
          return acc;
        }, {})
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [exams]);

  const getTimeRemaining = (examDate, examTime) => {
    const examDateTime = new Date(`${examDate}T${examTime}`);
    const now = new Date();
    const diff = examDateTime - now;
    if (diff <= 0) return "Started";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  };

  const toggleExpand = (index) => {
    if (editIndex !== null && editIndex !== index) return;
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEdit = (index, event) => {
    event.stopPropagation();
    setEditIndex(index);
    setExpandedIndex(index);
    setFormData(exams[index]);
  };

  const handleDelete = async (index, examId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/exams/${examId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete exam");

      fetchExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
      setError("Failed to delete exam. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/exams/${formData._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update exam");

      fetchExams();
      setEditIndex(null);
      setExpandedIndex(null);
    } catch (error) {
      console.error("Error updating exam:", error);
      setError("Failed to update exam. Please try again.");
    }
  };

  return (
    <div className="home-container">
      {error && <p className="error">{error}</p>}

      <motion.h1
        className="title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {"Exam Scheduler".split(" ").map((word, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.3 }}>
            {word}{" "}
          </motion.span>
        ))}
      </motion.h1>

      <p className="description">Stay ahead in your studies by tracking your upcoming exams with ease.</p>

      <div className="exams-list">
        {exams.length > 0 ? (
          <div className="grid">
            {exams.map((exam, index) => (
              <motion.div key={index} className="exam-card" onClick={() => toggleExpand(index)}>
                <div className="exam-box">
                  <h3 className="subject">{exam.subject}</h3>
                  <p className="timer">{timeLeft[index] || getTimeRemaining(exam.date, exam.time)}</p>
                </div>

                {expandedIndex === index && (
                  <motion.div className="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {editIndex === index ? (
                      <div>
                        <input name="examName" value={formData.examName} onChange={handleChange} />
                        <input name="subject" value={formData.subject} onChange={handleChange} />
                        <input name="date" type="date" value={formData.date} onChange={handleChange} />
                        <input name="time" type="time" value={formData.time} onChange={handleChange} />
                        <input name="duration" value={formData.duration} onChange={handleChange} />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} />
                        <button className="save-btn" onClick={handleSave}>Save</button>
                      </div>
                    ) : (
                      <div>
                        <p><strong>Exam Name:</strong> {exam.examName}</p>
                        <p><strong>Date:</strong> {exam.date}</p>
                        <p><strong>Time:</strong> {exam.time}</p>
                        <p><strong>Duration:</strong> {exam.duration} minutes</p>
                        <p><strong>Email:</strong> {exam.email}</p>
                        <div className="actions">
                          <button className="edit-btn" onClick={(e) => handleEdit(index, e)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(index, exam._id)}>Delete</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <p className="no-exams">No exams scheduled yet.</p>
            <Link to="/scheduler" className="scheduler-link">Click to add your exam</Link>
          </div>
        )}
      </div>
    </div>
  );
}
