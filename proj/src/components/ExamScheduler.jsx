import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import "./ExamScheduler.css"; // Import CSS for styling

export default function ExamScheduler() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examName: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Automatically get user email from localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setFormData((prev) => ({ ...prev, email: userEmail }));
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token"); // Retrieve token
      if (!token) throw new Error("Unauthorized: Please log in first.");

      const response = await fetch("http://localhost:5000/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to schedule exam.");
      }

      alert("✅ Exam scheduled successfully!");
      navigate("/"); // ✅ Redirect to Home page after scheduling
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-scheduler-container">
      <Card className="exam-scheduler-card">
        <CardContent>
          <h2 className="exam-scheduler-title">📅 Schedule an Exam</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="exam-scheduler-label">Exam Name</Label>
              <Input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleChange}
                required
                className="exam-scheduler-input"
              />
            </div>
            <br />

            <div>
              <Label className="exam-scheduler-label">Subject</Label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="exam-scheduler-input"
              />
            </div>
            <br />

            <div>
              <Label className="exam-scheduler-label">Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="exam-scheduler-input"
              />
            </div>
            <br />

            <div>
              <Label className="exam-scheduler-label">Time</Label>
              <Input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="exam-scheduler-input"
              />
            </div>
            <br />

            <div>
              <Label className="exam-scheduler-label">Duration (minutes)</Label>
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="exam-scheduler-input"
              />
            </div>
            <br />

            <div>
              <Label className="exam-scheduler-label">Your Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="exam-scheduler-input"
              />
            </div>
            <br />

            <Button type="submit" className="exam-scheduler-button" disabled={loading}>
              {loading ? "📌 Scheduling..." : "✅ Schedule Exam"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 