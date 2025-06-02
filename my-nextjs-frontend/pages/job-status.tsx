import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

// Updated Application type to match your database schema
type Application = {
  _id: string;
  nameWithInitials: string;
  fullName: string;
  field: string;
  email: string;
  contactNumber: string;
  status: string;
  createdAt: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNotes?: string;
  job: {
    _id: string;
    type: string;
    position: string;
    field: string;
  };
};

export default function JobStatus() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Load applications from API on component mount
  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Please login to view your applications");
          router.push("/login?redirect=/job-status");
          return;
        }
        
        const response = await fetch("http://localhost:5000/api/applications/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Handle non-200 responses without throwing errors
        if (!response.ok) {
          let errorMessage = "Failed to fetch your applications";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // If parsing JSON fails, use the default error message
          }
          
          console.error(`API Error (${response.status}): ${errorMessage}`);
          setError(errorMessage);
          return;
        }
        
        const data = await response.json();
        setApplications(data.applications);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load your applications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserApplications();
  }, [router]);

  // Function to handle application deletion
  const handleHideApplication = async (appId: string) => {
    if (window.confirm("Are you sure you want to hide this application from your view?")) {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          alert("Please login to manage your applications");
          router.push("/login");
          return;
        }
        
        const response = await fetch(`http://localhost:5000/api/applications/${appId}/hide`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          let errorMessage = "Failed to hide application";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {}
          
          throw new Error(errorMessage);
        }
        
        // Update local state - remove the hidden application
        setApplications(applications.filter(app => app._id !== appId));
        alert("Application has been hidden from your view");
      } catch (err: any) {
        console.error("Error hiding application:", err);
        alert(err.message || "An error occurred while hiding the application");
      }
    }
  };

  // Function to determine status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Shortlisted":
      case "Accepted":
        return "#28a745"; // green
      case "Rejected":
        return "#dc3545"; // red
      case "Reviewing":
        return "#fd7e14"; // orange
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
            <a href="/vacancies">Jobs for you</a>
            <span>|</span>
            <a href="/">Home</a>
            <span>|</span>
            <a href="/login">Login</a>
          </nav>
        </header>

        {/* Main Content */}
        <div className={styles.statusCard}>
          <h1 className={styles.statusHeading}>Your Job Applications</h1>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <p>Loading your applications...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#dc3545' }}>
              <p>{error}</p>
              <a 
                href="/login" 
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
                Login to View Applications
              </a>
            </div>
          ) : applications.length === 0 ? (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.job.type || app.job.position || "Job Position"}</td>
                    <td>{app.job.field || app.field}</td>
                    <td>{formatDate(app.createdAt)}</td>
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
                        <div className={styles.interviewDetails}>
                          {app.interviewDate ? (
                            <>
                              <div className={styles.interviewScheduled}>Interview Scheduled!</div>
                              <div className={styles.interviewInfo}>
                                <p><strong>Date:</strong> {app.interviewDate}</p>
                                <p><strong>Time:</strong> {app.interviewTime}</p>
                                <p><strong>Location:</strong> {app.interviewLocation}</p>
                                {app.interviewNotes && (
                                  <div className={styles.interviewNotes}>
                                    <strong>Additional Notes:</strong>
                                    <p>{app.interviewNotes}</p>
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <span className={styles.interviewPending}>
                              Your application is shortlisted.
                            </span>
                          )}
                        </div>
                      )}
                      {app.status === "Accepted" && (
                        <span className={styles.acceptedMessage}>
                          Congratulations! Your application has been accepted.
                        </span>
                      )}
                      {app.status === "Rejected" && (
                        <span className={styles.rejectedMessage}>
                          Application not selected for this position.
                        </span>
                      )}
                      {(app.status === "Pending" || app.status === "Reviewing") && (
                        <span className={styles.pendingMessage}>
                          Application still under review.
                        </span>
                      )}
                    </td>
                    <td>
                      {(app.status === "Shortlisted" && app.interviewDate) || 
                       app.status === "Rejected" ||
                       app.status === "Accepted" ? (
                        // Allow hiding if interview is scheduled OR application is rejected/accepted
                        <button
                          onClick={() => handleHideApplication(app._id)}
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
                          Hide
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
                                ? "Cannot hide until interview is scheduled" 
                                : "Cannot hide until application is processed"
                            }
                          >
                            Hide
                          </button>
                          <span style={{
                            position: "absolute",
                            bottom: "-20px",
                            left: "0",
                            fontSize: "11px",
                            color: "#666",
                            whiteSpace: "nowrap"
                          }}>
                            {app.status === "Pending" || app.status === "Reviewing" 
                              ? "Application under review" 
                              : "Awaiting interview details"}
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