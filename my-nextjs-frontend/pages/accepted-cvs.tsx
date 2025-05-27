import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";

type Application = {
  jobTitle: string;
  nameWithInitials: string;
  fullName: string;
  email: string;
  contactNumber: string;
  field: string;
  cvFileName: string | null;
  submissionDate: string;
  status: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNotes?: string;
};

export default function AcceptedCVs() {
  const router = useRouter();
  const [shortlistedApplications, setShortlistedApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [interviewDetails, setInterviewDetails] = useState({
    date: "",
    time: "",
    location: "",
    notes: ""
  });

  // Load shortlisted applications from localStorage on component mount
  useEffect(() => {
    const allApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    // Filter only applications with "Shortlisted" status
    const shortlisted = allApplications.filter(app => app.status === "Shortlisted");
    setShortlistedApplications(shortlisted);
    setFilteredApplications(shortlisted);
  }, []);

  // Filter applications based on search input
  useEffect(() => {
    if (search) {
      const filtered = shortlistedApplications.filter((app) =>
        app.nameWithInitials.toLowerCase().includes(search.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(shortlistedApplications);
    }
  }, [search, shortlistedApplications]);

  // Open interview scheduling modal
  const handleScheduleInterview = (app: Application) => {
    setCurrentApp(app);
    setInterviewDetails({
      date: app.interviewDate || "",
      time: app.interviewTime || "",
      location: app.interviewLocation || "",
      notes: app.interviewNotes || ""
    });
    setShowModal(true);
  };

  // Handle input changes in the modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInterviewDetails({
      ...interviewDetails,
      [name]: value
    });
  };

  // Save interview details
  const handleSaveInterview = () => {
    if (!currentApp) return;
    
    // Update the application with interview details
    const updatedApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    const appIndex = updatedApplications.findIndex(
      (app: Application) => 
        app.nameWithInitials === currentApp.nameWithInitials && 
        app.jobTitle === currentApp.jobTitle &&
        app.submissionDate === currentApp.submissionDate
    );
    
    if (appIndex !== -1) {
      updatedApplications[appIndex] = {
        ...updatedApplications[appIndex],
        interviewDate: interviewDetails.date,
        interviewTime: interviewDetails.time,
        interviewLocation: interviewDetails.location,
        interviewNotes: interviewDetails.notes
      };
      
      localStorage.setItem("applications", JSON.stringify(updatedApplications));
      
      // Update the local state
      const updatedShortlisted = shortlistedApplications.map(app => {
        if (
          app.nameWithInitials === currentApp.nameWithInitials && 
          app.jobTitle === currentApp.jobTitle &&
          app.submissionDate === currentApp.submissionDate
        ) {
          return {
            ...app,
            interviewDate: interviewDetails.date,
            interviewTime: interviewDetails.time,
            interviewLocation: interviewDetails.location,
            interviewNotes: interviewDetails.notes
          };
        }
        return app;
      });
      
      setShortlistedApplications(updatedShortlisted);
      setFilteredApplications(updatedShortlisted);
    }
    
    setShowModal(false);
    setCurrentApp(null);
    alert("Interview scheduled successfully!");
  };

  // View detailed CV info
  const handleViewDetails = (app: Application) => {
    let details = `
      Job: ${app.jobTitle}
      Name: ${app.fullName}
      Email: ${app.email}
      Contact: ${app.contactNumber}
      Field: ${app.field}
      CV: ${app.cvFileName || "No file"}
      Submitted: ${new Date(app.submissionDate).toLocaleDateString()}
      Status: ${app.status}
    `;
    
    if (app.interviewDate) {
      details += `
      \n--- Interview Details ---
      Date: ${app.interviewDate}
      Time: ${app.interviewTime}
      Location: ${app.interviewLocation}
      Notes: ${app.interviewNotes || "None"}
      `;
    }
    
    alert(details);
  };

  return (
    <>
      {/* Top Navbar */}
      <header className={homeStyles.topBar}>
        <img src="/logo.png" alt="Logo" className={homeStyles.logo} />
        <span className={homeStyles.title}>Training Program</span>
        <nav className={homeStyles.nav}>
          <a href="/">Home</a>
          <span>|</span>
          <a href="/login">Logout</a>
        </nav>
      </header>

      <div className={styles.bg}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.menu}>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/job-creation")}
              style={{ cursor: "pointer" }}
            >
              ▶ Job Creation
            </div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/job-modification")}
              style={{ cursor: "pointer" }}
            >
              ▶ Job Modification
            </div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/received-cvs")}
              style={{ cursor: "pointer" }}
            >
              ▶ Received CVs
            </div>
            <div className={`${styles.menuItem} ${styles.menuItemActive}`}>
              ▶ Accepted CVs
            </div>
          </div>
        </aside>

        <main className={styles.content}>
          {/* Search Bar */}
          <div className={styles.jobModSearchRow}>
            <input
              className={styles.jobModSearchInput}
              type="text"
              placeholder="Search by name or job title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <h2 style={{ textAlign: 'center', margin: '20px 0', color: '#0055A2' }}>
            Shortlisted Candidates
          </h2>

          {/* Shortlisted Applications Table */}
          <div className={styles.jobModTableWrapper}>
            <table className={styles.jobModTable}>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Applicant Name</th>
                  <th>Email</th>
                  <th>Interview Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No shortlisted applications found.</td>
                  </tr>
                ) : (
                  filteredApplications.map((app, idx) => (
                    <tr key={idx}>
                      <td>{app.jobTitle}</td>
                      <td>{app.nameWithInitials}</td>
                      <td>{app.email}</td>
                      <td>
                        {app.interviewDate ? (
                          <span style={{ 
                            background: "#28a745", 
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px"
                          }}>
                            Scheduled: {app.interviewDate}
                          </span>
                        ) : (
                          <span style={{ 
                            background: "#dc3545", 
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px" 
                          }}>
                            Not Scheduled
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.viewBtn}
                          onClick={() => handleViewDetails(app)}
                          style={{ 
                            background: "#0055A2",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            marginRight: "5px",
                            cursor: "pointer"
                          }}
                        >
                          View
                        </button>
                        <button
                          className={styles.interviewBtn}
                          onClick={() => handleScheduleInterview(app)}
                          style={{ 
                            background: app.interviewDate ? "#f0ad4e" : "#5cb85c",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            cursor: "pointer" 
                          }}
                        >
                          {app.interviewDate ? "Reschedule" : "Schedule Interview"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Interview Scheduling Modal */}
          {showModal && currentApp && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "500px",
                maxWidth: "90%"
              }}>
                <h3 style={{ marginTop: 0, color: "#0055A2" }}>
                  Schedule Interview for {currentApp.fullName}
                </h3>
                
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Interview Date:
                  </label>
                  <input 
                    type="date" 
                    name="date"
                    value={interviewDetails.date}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Interview Time:
                  </label>
                  <input 
                    type="time" 
                    name="time"
                    value={interviewDetails.time}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Location:
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    value={interviewDetails.location}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                    placeholder="E.g., Office, Online, Conference Room"
                    required
                  />
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                    Notes:
                  </label>
                  <textarea 
                    name="notes"
                    value={interviewDetails.notes}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      minHeight: "100px"
                    }}
                    placeholder="Add any additional information about the interview"
                  />
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button 
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveInterview}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#0055A2",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}