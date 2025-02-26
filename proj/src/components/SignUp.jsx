import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css"; // Import the CSS file

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Sign Up Details:", formData);
    alert("Account Created Successfully!");
    navigate("/signin"); // Redirect to Sign In page
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          
          <label>Username</label>
          <input
            type="text"
            name="username"
            required
            className="auth-input"
            value={formData.username}
            onChange={handleChange}
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            required
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            required
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="auth-input"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
