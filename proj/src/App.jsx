import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./styles.css";
import ExamScheduler from "./components/ExamScheduler";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Navbar from "./components/Navbar";

function App() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  // ✅ Load exams from localStorage on mount
  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
    setExams(storedExams);
  }, []);

  // ✅ Save exams to localStorage on update
  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);

  // ✅ Add new exam and navigate to home
  const addExam = (exam) => {
    setExams([...exams, exam]);
    navigate("/"); // Redirect to Home after scheduling
  };

  // ✅ Remove exam by index
  const deleteExam = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  // ✅ Edit exam by index
  const editExam = (index, updatedExam) => {
    setExams(exams.map((exam, i) => (i === index ? updatedExam : exam)));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/" element={<Home exams={exams} deleteExam={deleteExam} editExam={editExam} />} />
          <Route path="/scheduler" element={<ExamScheduler addExam={addExam} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
