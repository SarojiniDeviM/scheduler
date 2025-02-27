import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Home.css";

export default function Home() {
  const [exams, setExams] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    examName: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    email: ""
  });

  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
    setExams(storedExams);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(() => {
        return exams.reduce((acc, exam, index) => {
          acc[index] = getTimeRemaining(exam.date, exam.time);
          return acc;
        }, {});
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [exams]);

  const toggleExpand = (index) => {
    if (editIndex !== null) return; // Prevent collapsing while editing
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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

  const handleEdit = (index, event) => {
    event.stopPropagation(); // Prevents click from collapsing the card
    setEditIndex(index);
    setExpandedIndex(index); // Ensure it remains expanded
    setFormData(exams[index]);
  };

  const handleDelete = (index) => {
    const updatedExams = exams.filter((_, i) => i !== index);
    setExams(updatedExams);
    localStorage.setItem("exams", JSON.stringify(updatedExams));
    setExpandedIndex(null);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedExams = exams.map((exam, i) => (i === editIndex ? formData : exam));
    setExams(updatedExams);
    localStorage.setItem("exams", JSON.stringify(updatedExams));
    setEditIndex(null);
    setExpandedIndex(null);
  };

  return (
    <div className="home-container">
      <motion.h1 className="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        {"Exam Scheduler".split(" ").map((word, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.3 }}>{word} </motion.span>
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
                        <input name="examName" value={formData.examName} onChange={handleChange} className="block w-full mb-2 p-1 text-black" />
                        <input name="subject" value={formData.subject} onChange={handleChange} className="block w-full mb-2 p-1 text-black" />
                        <input name="date" value={formData.date} onChange={handleChange} className="block w-full mb-2 p-1 text-black" />
                        <input name="time" value={formData.time} onChange={handleChange} className="block w-full mb-2 p-1 text-black" />
                        <input name="duration" value={formData.duration} onChange={handleChange} className="block w-full mb-2 p-1 text-black" />
                        <input name="email" value={formData.email} onChange={handleChange} className="block w-full mb-2 p-1 text-black" />
                        <button className="bg-green-500 text-white py-1 px-3 rounded" onClick={handleSave}>Save</button>
                      </div>
                    ) : (
                      <div>
                        <p><strong>Exam Name:</strong> {exam.examName}</p>
                        <p><strong>Date:</strong> {exam.date}</p>
                        <p><strong>Time:</strong> {exam.time}</p>
                        <p><strong>Duration:</strong> {exam.duration} minutes</p>
                        <p><strong>Email:</strong> {exam.email}</p>
                        <div className="actions">
                          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded" onClick={(e) => handleEdit(index, e)}>Edit</button>
                          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded" onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="no-exams">No exams scheduled yet.</p>
        )}
      </div>
    </div>
  );
}
