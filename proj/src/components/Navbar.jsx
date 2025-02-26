import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">Exam Scheduler</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/scheduler">Scheduler</Link>
        </li>
        <li>
          <Link to="/signin" className="btn">Sign In</Link>
        </li>
        <li>
          <Link to="/signup" className="btn">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
