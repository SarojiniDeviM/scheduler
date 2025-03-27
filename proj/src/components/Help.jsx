import React from "react";
import "./Help.css";

const HelpPage = () => {
  return (
    <div className="help-container">
      <h1 className="help-title">Exam Scheduler - Help Page</h1>
      
      <section className="help-section">
        <h2>Introduction</h2>
        <p>
          The Exam Scheduler helps you efficiently manage and schedule exams. Use this guide to understand how to navigate and use the system.
        </p>
      </section>
      
      <section className="help-section">
        <h2>How to Schedule an Exam?</h2>
        <ul>
          <li>Go to the "Schedule Exam" page.</li>
          <li>Enter the exam details such as subject, date, and time.</li>
          <li>Select the exam room and assign invigilators.</li>
          <li>Click the "Submit" button to save the schedule.</li>
        </ul>
      </section>
      
      <section className="help-section help-faq">
        <h2>FAQs</h2>
        <p><strong>Q: Can I edit a scheduled exam?</strong></p>
        <p>A: Yes, go to the "Manage Exams" section and click "Edit" next to the exam you want to modify.</p>
        
        <p><strong>Q: How do I delete an exam?</strong></p>
        <p>A: In the "Manage Exams" section, click the "Delete" button next to the exam.</p>
      </section>
      
      <section className="help-section">
        <h2>Need More Help?</h2>
        <p>If you have further questions, contact support at <span className="help-contact">support@example.com</span>.</p>
      </section>
    </div>
  );
};

export default HelpPage;
