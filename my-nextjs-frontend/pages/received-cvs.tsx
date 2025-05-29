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
  hiddenFromAdmin?: boolean; // Optional field to track "deleted for admin" status
};

export default function ReceivedCVs() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  // Load applications from localStorage on component mount
  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    // Only show applications that haven't been hidden from admin
    const visibleApplications = savedApplications.filter(app => !app.hiddenFromAdmin);
    setApplications(visibleApplications);
    setFilteredApplications(visibleApplications);
  }, []);

  // Filter applications based on search input
  useEffect(() => {
    if (search) {
      const filtered = applications.filter((app) =>
        app.nameWithInitials.toLowerCase().includes(search.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(applications);
    }
  }, [search, applications]);

  // Handle application status change
  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedApplications = [...applications];
    updatedApplications[index].status = newStatus;
    
    setApplications(updatedApplications);
    localStorage.setItem("applications", JSON.stringify(updatedApplications));
    setEditIndex(-1);
    
    // Show confirmation
    alert(`Application status has been changed to ${newStatus}`);
  };

  // View CV details
  const handleViewDetails = (app: Application) => {
    setViewingApp(app);
    setShowViewModal(true);
  };

  // Download CV file (mock implementation)
  const handleDownloadCV = (app: Application) => {
    // In a real application, this would access file storage and download the actual file
    // For this demo, we'll just show an alert
    if (app.cvFileName) {
      alert(`In a production environment, this would download the file: ${app.cvFileName}`);
    } else {
      alert("No CV file available for this application.");
    }
  };

  // Handle application deletion
  const handleDeleteApplication = (app: Application, idx: number) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this application from admin view? Users will still see their applications.")) {
      try {
        // Get all applications directly from localStorage
        const allApplications = JSON.parse(localStorage.getItem("applications") || "[]");
        
        // Find the specific application to mark as deleted for admin
        const updatedApplications = allApplications.map(savedApp => {
          if (
            savedApp.nameWithInitials === app.nameWithInitials && 
            savedApp.jobTitle === app.jobTitle && 
            savedApp.submissionDate === app.submissionDate
          ) {
            // Mark as deleted for admin view only
            return { ...savedApp, hiddenFromAdmin: true };
          }
          return savedApp;
        });
        
        // Update localStorage
        localStorage.setItem("applications", JSON.stringify(updatedApplications));
        
        // Update local state - filter out admin-deleted applications
        const visibleApplications = updatedApplications.filter(app => !app.hiddenFromAdmin);
        setApplications(visibleApplications);
        setFilteredApplications(visibleApplications.filter(a => 
          !search || 
          a.nameWithInitials.toLowerCase().includes(search.toLowerCase()) ||
          a.jobTitle.toLowerCase().includes(search.toLowerCase())
        ));
        
        // Show confirmation
        alert("Application has been removed from admin view");
      } catch (error) {
        console.error("Error hiding application:", error);
        alert("An error occurred while removing the application");
      }
    }
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
            <div className={`${styles.menuItem} ${styles.menuItemActive}`}>
              ▶ Received CVs
            </div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/accepted-cvs")}
              style={{ cursor: "pointer" }}
            >
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

          {/* Applications Table */}
          <div className={styles.jobModTableWrapper}>
            <table className={styles.jobModTable}>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Applicant Name</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No applications found.</td>
                  </tr>
                ) : (
                  filteredApplications.map((app, idx) => (
                    <tr key={idx}>
                      <td>{app.jobTitle}</td>
                      <td>{app.nameWithInitials}</td>
                      <td>{new Date(app.submissionDate).toLocaleDateString()}</td>
                      <td>
                        {editIndex === applications.indexOf(app) ? (
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(applications.indexOf(app), e.target.value)}
                            style={{ fontSize: "15px", borderRadius: "8px", padding: "4px 8px" }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span
                            className={
                              app.status === "Shortlisted" 
                                ? styles.accepted 
                                : app.status === "Rejected" 
                                ? styles.jobModRejected 
                                : styles.pending
                            }
                          >
                            {app.status}
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
                          className={styles.editBtn}
                          onClick={() => setEditIndex(applications.indexOf(app))}
                          style={{ 
                            background: "#555",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            cursor: "pointer" 
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.downloadBtn}
                          onClick={() => handleDownloadCV(app)}
                          style={{ 
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            marginLeft: "5px",
                            cursor: "pointer"
                          }}
                        >
                          📥 CV
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteApplication(app, idx)} // Pass both app object and index
                          style={{ 
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            marginLeft: "5px",
                            cursor: "pointer"
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* View Application Details Modal */}
          {showViewModal && viewingApp && (
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
                  Application Details
                </h3>
                
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", rowGap: "10px" }}>
                    <strong>Job Title:</strong>
                    <span>{viewingApp.jobTitle}</span>
                    
                    <strong>Name with Initials:</strong>
                    <span>{viewingApp.nameWithInitials}</span>
                    
                    <strong>Full Name:</strong>
                    <span>{viewingApp.fullName}</span>
                    
                    <strong>Email:</strong>
                    <span>{viewingApp.email}</span>
                    
                    <strong>Contact Number:</strong>
                    <span>{viewingApp.contactNumber}</span>
                    
                    <strong>Field:</strong>
                    <span>{viewingApp.field}</span>
                    
                    <strong>CV:</strong>
                    <span>{viewingApp.cvFileName || "No file"}</span>
                    
                    <strong>Submitted On:</strong>
                    <span>{new Date(viewingApp.submissionDate).toLocaleDateString()}</span>
                    
                    <strong>Status:</strong>
                    <span style={{
                      background: viewingApp.status === "Shortlisted" ? "#28a745" : 
                                 viewingApp.status === "Rejected" ? "#dc3545" : "#ffc107",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      display: "inline-block",
                      fontSize: "14px"
                    }}>
                      {viewingApp.status}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {viewingApp.cvFileName && (
                    <button 
                      onClick={() => handleDownloadCV(viewingApp)}
                      style={{
                        padding: "8px 16px",
                        marginRight: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <span style={{ marginRight: "5px" }}>📥</span> Download CV
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setShowViewModal(false)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#0055A2",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Close
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