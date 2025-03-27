import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Home.css";


export default function Home() {
  const [exams, setExams] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/exams", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
      setError("Sign in to check your scheduled exams.");
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(() => {
        const newTimeLeft = {};
        exams.forEach((exam, index) => {
          newTimeLeft[index] = getTimeRemaining(exam.date);
        });
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [exams]);

  const getTimeRemaining = (examDate) => {
    const examDateTime = new Date(examDate); 

    if (isNaN(examDateTime.getTime())) {
      return "Invalid Date/Time";
    }

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
    if (editIndex === index) return; 
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEdit = (index, event) => {
    event.stopPropagation();
    setEditIndex(index);
    setExpandedIndex(index);
    setFormData({ ...exams[index] });
  };

  const handleDelete = async (examId) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {error && <p className="error">{error}</p>}

      <motion.h1 className="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        Exam Scheduler
      </motion.h1>

      {loading ? (
        <p className="loading">Loading exams...</p>
      ) : (
        <div className="exams-list">
          {exams.length > 0 ? (
            <div className="grid">
              {exams.map((exam, index) => (
                <motion.div key={exam._id} className="exam-card" onClick={() => toggleExpand(index)}>
                  <div className="exam-box">
                    <h3 className="subject">{exam.subject}</h3>
                    <p className="timer">{timeLeft[index] || getTimeRemaining(exam.date)}</p>
                  </div>

                  {expandedIndex === index && (
                    <motion.div className="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {editIndex === index ? (
                        <div onClick={(e) => e.stopPropagation()}>
                          <label>Exam Name:</label>
                          <input name="examName" value={formData.examName} onChange={handleChange} />
                          
                          <label>Subject:</label>
                          <input name="subject" value={formData.subject} onChange={handleChange} />

                          <label>Date:</label>
                          <input type="date" name="date" value={formData.date.split("T")[0]} onChange={handleChange} />

                          <label>Time:</label>
                          <input type="time" name="time" value={formData.time} onChange={handleChange} />

                          <label>Duration:</label>
                          <input name="duration" value={formData.duration} onChange={handleChange} />

                          <button className="save-btn" onClick={handleSave}>Save</button>
                        </div>
                      ) : (
                        <div>
                          <p><strong>Exam Name:</strong> {exam.examName}</p>
                          <p><strong>Subject:</strong> {exam.subject}</p>
                          <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString('en-GB')}</p>
                          <p><strong>Time:</strong> {exam.time}</p>
                          <p><strong>Duration:</strong> {exam.duration} minutes</p>

                          <div className="actions">
                            <button className="edit-btn" onClick={(e) => handleEdit(index, e)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(exam._id)}>Delete</button>
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
      )}
    </div>
  );
}
