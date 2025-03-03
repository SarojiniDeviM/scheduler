import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import "./ExamScheduler.css"; // Import the CSS file

export default function ExamScheduler() {
  const navigate = useNavigate(); // To redirect to home after submission
  const [formData, setFormData] = useState({
    examName: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing exams from localStorage
    const storedExams = JSON.parse(localStorage.getItem("exams")) || [];

    // Add new exam to the list
    const updatedExams = [...storedExams, formData];

    // Save updated exams list to localStorage
    localStorage.setItem("exams", JSON.stringify(updatedExams));

    console.log("Scheduled Exam:", formData);
    alert(`Exam scheduled successfully!`);

    // Redirect to Home page
    navigate("/");
  };

  return (
    <div className="exam-scheduler-container">
      
      {/* Form Section */}
      <Card className="exam-scheduler-card">
        <CardContent>
          <h2 className="exam-scheduler-title">Schedule an Exam</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <Label className="exam-scheduler-label">Exam Name</Label>
              <Input type="text" name="examName" value={formData.examName} onChange={handleChange} required className="exam-scheduler-input" />
            </div>
            <br></br>

            <div>
              <Label className="exam-scheduler-label">Subject</Label>
              <Input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="exam-scheduler-input" />
            </div>
            <br></br>

            <div>
              <Label className="exam-scheduler-label">Date</Label>
              <Input type="date" name="date" value={formData.date} onChange={handleChange} required className="exam-scheduler-input" />
            </div>
            <br></br>

            <div>
              <Label className="exam-scheduler-label">Time</Label>
              <Input type="time" name="time" value={formData.time} onChange={handleChange} required className="exam-scheduler-input" />
            </div>
            <br></br>

            <div>
              <Label className="exam-scheduler-label">Duration (minutes)</Label>
              <Input type="number" name="duration" value={formData.duration} onChange={handleChange} required className="exam-scheduler-input" />
            </div>
            <br></br>

            <div>
              <Label className="exam-scheduler-label">Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required className="exam-scheduler-input" />
            </div>

            <Button type="submit" className="exam-scheduler-button">
              Schedule Exam
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
