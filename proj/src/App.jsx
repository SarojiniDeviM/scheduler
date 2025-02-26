import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./styles.css";
import ExamScheduler from "./components/ExamScheduler";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Navbar from "./components/Navbar";

function App() {
  const [exams, setExams] = useState([]); // Store all scheduled exams

  const addExam = (exam) => {
    setExams([...exams, exam]); // Add new exam
  };

  const deleteExam = (index) => {
    setExams(exams.filter((_, i) => i !== index)); // Remove exam by index
  };

  const editExam = (index, updatedExam) => {
    const updatedExams = exams.map((exam, i) => (i === index ? updatedExam : exam));
    setExams(updatedExams); // Update exam
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home exams={exams} deleteExam={deleteExam} editExam={editExam} />} />
        <Route path="/scheduler" element={<ExamScheduler addExam={addExam} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
