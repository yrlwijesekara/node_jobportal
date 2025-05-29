import React, { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";
import viewerStyles from "../styles/ApplicationViewer.module.css";

type Application = {
  interviewNotes: React.JSX.Element;
  interviewLocation: ReactNode;
  interviewTime: ReactNode;
  interviewDate: React.JSX.Element;
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
    const visibleApplications = savedApplications.filter((app: { hiddenFromAdmin: any; }) => !app.hiddenFromAdmin);
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
        const updatedApplications = allApplications.map((savedApp: { nameWithInitials: string; jobTitle: string; submissionDate: string; }) => {
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
        const visibleApplications = updatedApplications.filter((app: { hiddenFromAdmin: any; }) => !app.hiddenFromAdmin);
        setApplications(visibleApplications);
        setFilteredApplications(visibleApplications.filter((a: { nameWithInitials: string; jobTitle: string; }) => 
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
                          className={`${viewerStyles.tableBtn} ${viewerStyles.tableViewBtn}`}
                          onClick={() => handleViewDetails(app)}
                        >
                          View
                        </button>
                        <button
                          className={`${viewerStyles.tableBtn} ${viewerStyles.tableEditBtn}`}
                          onClick={() => setEditIndex(applications.indexOf(app))}
                        >
                          Edit
                        </button>
                        <button
                          className={`${viewerStyles.tableBtn} ${viewerStyles.tableDownloadBtn}`}
                          onClick={() => handleDownloadCV(app)}
                        >
                          📥 CV
                        </button>
                        <button
                          className={`${viewerStyles.tableBtn} ${viewerStyles.tableDeleteBtn}`}
                          onClick={() => handleDeleteApplication(app, idx)}
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
            <div className={viewerStyles.modalOverlay}>
              <div className={viewerStyles.modalContainer}>
                <h3 className={viewerStyles.modalTitle}>
                  Application Details
                </h3>
                
                <div className={viewerStyles.modalSection}>
                  <div className={viewerStyles.modalGrid}>
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
                    <span className={`${viewerStyles.statusBadge} ${
                      viewingApp.status === "Shortlisted" ? viewerStyles.statusShortlisted : 
                      viewingApp.status === "Rejected" ? viewerStyles.statusRejected : 
                      viewerStyles.statusPending
                    }`}>
                      {viewingApp.status}
                    </span>
                  </div>
                  
                  {/* Show interview details if they exist */}
                  {viewingApp.interviewDate && (
                    <>
                      <h4 className={viewerStyles.sectionTitle}>
                        Interview Details
                      </h4>
                      <div className={viewerStyles.modalGrid}>
                        <strong>Date:</strong>
                        <span>{viewingApp.interviewDate}</span>
                        
                        <strong>Time:</strong>
                        <span>{viewingApp.interviewTime}</span>
                        
                        <strong>Location:</strong>
                        <span>{viewingApp.interviewLocation}</span>
                        
                        {viewingApp.interviewNotes && (
                          <>
                            <strong>Notes:</strong>
                            <span className={viewerStyles.preWrap}>{viewingApp.interviewNotes}</span>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                <div className={viewerStyles.modalActions}>
                  {viewingApp.cvFileName && (
                    <button 
                      onClick={() => handleDownloadCV(viewingApp)}
                      className={`${viewerStyles.btn} ${viewerStyles.btnSuccess}`}
                    >
                      <span className={viewerStyles.iconMargin}>📥</span> Download CV
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setEditIndex(applications.indexOf(viewingApp))}
                    className={`${viewerStyles.btn} ${viewerStyles.btnSecondary}`}
                  >
                    Edit Status
                  </button>
                  
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className={`${viewerStyles.btn} ${viewerStyles.btnPrimary}`}
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