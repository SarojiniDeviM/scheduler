import { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [exams, setExams] = useState([]);
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

  const handleDelete = (index) => {
    const updatedExams = exams.filter((_, i) => i !== index);
    setExams(updatedExams);
    localStorage.setItem("exams", JSON.stringify(updatedExams));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(exams[index]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedExams = exams.map((exam, i) => (i === editIndex ? formData : exam));
    setExams(updatedExams);
    localStorage.setItem("exams", JSON.stringify(updatedExams));
    setEditIndex(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mt-6 text-gray-800">Welcome to Exam Scheduler</h1>
      <div className="w-full max-w-2xl mt-6">
        <h2 className="text-xl font-bold text-gray-700 mb-3">Scheduled Exams</h2>
        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam, index) => (
              <div key={index} className="bg-blue-500 text-white shadow-md rounded-lg p-4 border border-blue-700">
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
                    <h3 className="text-lg font-semibold">{exam.examName}</h3>
                    <p><strong>Subject:</strong> {exam.subject}</p>
                    <p><strong>Date:</strong> {exam.date}</p>
                    <p><strong>Time:</strong> {exam.time}</p>
                    <p><strong>Duration:</strong> {exam.duration} minutes</p>
                    <p><strong>Email:</strong> {exam.email}</p>
                    <div className="flex justify-between mt-3">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded" onClick={() => handleEdit(index)}>Edit</button>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded" onClick={() => handleDelete(index)}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No exams scheduled yet.</p>
        )}
      </div>
    </div>
  );
}