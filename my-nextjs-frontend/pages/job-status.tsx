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
  hiddenFromUser?: boolean; // Add this flag to track user-side deletions
};

export default function JobStatus() {
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Load applications from localStorage - filtered to exclude user-hidden ones
  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    // Only show applications NOT hidden from user
    const visibleApplications = savedApplications.filter(app => !app.hiddenFromUser);
    setApplications(visibleApplications);
  }, []);

  // Function to handle user deletion (hide from user view only)
  const handleDeleteApplication = (app: Application) => {
    if (window.confirm("Are you sure you want to delete this application from your view?")) {
      try {
        // Get all applications from localStorage
        const allApplications = JSON.parse(localStorage.getItem("applications") || "[]");
        
        // Mark the specific application as hidden for user
        const updatedApplications = allApplications.map(savedApp => {
          if (
            savedApp.nameWithInitials === app.nameWithInitials && 
            savedApp.jobTitle === app.jobTitle && 
            savedApp.submissionDate === app.submissionDate
          ) {
            // Mark as hidden for user view only
            return { ...savedApp, hiddenFromUser: true };
          }
          return savedApp;
        });
        
        // Update localStorage
        localStorage.setItem("applications", JSON.stringify(updatedApplications));
        
        // Update state - remove the deleted application from view
        setApplications(applications.filter(a => 
          !(a.nameWithInitials === app.nameWithInitials && 
            a.jobTitle === app.jobTitle && 
            a.submissionDate === app.submissionDate)
        ));
        
        // Show confirmation
        alert("Application has been removed from your view");
      } catch (error) {
        console.error("Error hiding application:", error);
        alert("An error occurred while removing the application");
      }
    }
  };

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
                  <th>Actions</th> {/* Add this column */}
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
                    <td>
                      {(app.status === "Shortlisted" && app.interviewDate) || app.status === "Rejected" ? (
                        // Allow deletion if interview is scheduled OR application is rejected
                        <button
                          onClick={() => handleDeleteApplication(app)}
                          style={{ 
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        // Disabled button with tooltip for pending or shortlisted without interview
                        <div style={{ position: "relative" }}>
                          <button
                            disabled
                            style={{ 
                              background: "#6c757d",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "5px 10px",
                              cursor: "not-allowed",
                              fontSize: "14px",
                              opacity: "0.65"
                            }}
                            title={
                              app.status === "Shortlisted" 
                                ? "Cannot delete until interview is scheduled" 
                                : "Cannot delete until application is processed"
                            }
                          >
                            Delete
                          </button>
                          <span style={{
                            position: "absolute",
                            bottom: "-20px",
                            left: "0",
                            fontSize: "11px",
                            color: "#666",
                            whiteSpace: "nowrap"
                          }}>
                            {app.status === "Pending" ? "Application under review" : "Awaiting interview details"}
                          </span>
                        </div>
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