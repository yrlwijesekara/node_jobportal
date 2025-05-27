import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

type Application = {
  jobTitle: string;
  nameWithInitials: string;
  fullName: string;
  field: string;
  email: string;
  status: string;
  submissionDate: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNotes?: string;
};

export default function JobStatus() {
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Load applications from localStorage
  useEffect(() => {
    // In a real app, you'd filter by the logged-in user
    // For now, we'll show all applications
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    setApplications(savedApplications);
  }, []);

  // Function to determine status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Shortlisted":
        return "#28a745"; // green
      case "Rejected":
        return "#dc3545"; // red
      default:
        return "#ffc107"; // yellow for pending
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={styles.vacanciesBg}>
      <div className={styles.container}>
        {/* Top Navigation Bar */}
        <header className={styles.topBar}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <span className={styles.title}>Training Program</span>
          <nav className={styles.nav}>
            <a href="/job-status" className={styles.active}>Job status</a>
            
            <span>|</span>
            <a href="/jobs">Jobs</a>
            <span>|</span>
            <a href="/vacancies">jobs for you</a>
            <span>|</span>
            <a href="/">Home</a>
            <span>|</span>
            <a href="/login">Login</a>
          </nav>
        </header>

        {/* Main Content */}
        <div className={styles.statusCard}>
          <h1 className={styles.statusHeading}>Your Job Applications</h1>
          
          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p>You haven't applied for any jobs yet.</p>
              <a 
                href="/jobs" 
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  background: '#0055A2',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  textDecoration: 'none'
                }}
              >
                Browse Available Jobs
              </a>
            </div>
          ) : (
            <table className={styles.statusTable}>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Field</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Interview Details</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={index}>
                    <td>{app.jobTitle}</td>
                    <td>{app.field}</td>
                    <td>{formatDate(app.submissionDate)}</td>
                    <td>
                      <span style={{
                        background: getStatusColor(app.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === "Shortlisted" && (
                        <div>
                          {app.interviewDate ? (
                            <div style={{ fontSize: '14px' }}>
                              <div><strong>Date:</strong> {app.interviewDate}</div>
                              <div><strong>Time:</strong> {app.interviewTime}</div>
                              <div><strong>Location:</strong> {app.interviewLocation}</div>
                              {app.interviewNotes && (
                                <div>
                                  <strong>Notes:</strong>
                                  <p style={{ 
                                    margin: '3px 0',
                                    fontStyle: 'italic',
                                    fontSize: '13px'
                                  }}>
                                    {app.interviewNotes}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#666', fontStyle: 'italic' }}>
                              Interview to be scheduled
                            </span>
                          )}
                        </div>
                      )}
                      {app.status === "Rejected" && (
                        <span style={{ color: '#666', fontStyle: 'italic' }}>
                          Application not selected
                        </span>
                      )}
                      {app.status === "Pending" && (
                        <span style={{ color: '#666', fontStyle: 'italic' }}>
                          Under review
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}