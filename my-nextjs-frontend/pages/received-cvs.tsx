import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";
import viewerStyles from "../styles/ApplicationViewer.module.css";

// Updated Application type to match your database schema
type Application = {
  _id: string;
  nameWithInitials: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  contactNumber: string;
  field: string;
  cvFilePath: string;
  status: string;
  createdAt: string;
  job: {
    _id: string;
    jobId: string;
    type: string;
    position: string;
  };
  // Optional interview fields
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNotes?: string;
};

export default function ReceivedCVs() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState<string | null>(null); // Track download state

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          // Instead of just pushing to login, also set an error
          setError("Authentication required. Please log in.");
          router.push("/login");
          return;
        }
        
        const response = await fetch("http://localhost:5000/api/applications/all", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Handle non-200 responses without throwing errors
        if (!response.ok) {
          // Try to extract error message from response
          let errorMessage = "Failed to fetch applications";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // If parsing JSON fails, use the default error message
          }
          
          console.error(`API Error (${response.status}): ${errorMessage}`);
          setError(errorMessage);
          return; // Exit early instead of throwing
        }
        
        const data = await response.json();
        setApplications(data.applications);
        setFilteredApplications(data.applications);
      } catch (err) {
        // This will now only catch network errors or other unexpected exceptions
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [router]);

  // Filter applications based on search input
  useEffect(() => {
    if (search) {
      const filtered = applications.filter((app) =>
        app.nameWithInitials.toLowerCase().includes(search.toLowerCase()) ||
        (app.job.type || app.job.position || "").toLowerCase().includes(search.toLowerCase())
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(applications);
    }
  }, [search, applications]);

  // Handle application status change
  const handleStatusChange = async (application: Application, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/applications/${application._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update application status");
      }
      
      // Update local state
      const updatedApplications = applications.map(app => 
        app._id === application._id ? { ...app, status: newStatus } : app
      );
      
      setApplications(updatedApplications);
      setFilteredApplications(
        search ? updatedApplications.filter(app => 
          app.nameWithInitials.toLowerCase().includes(search.toLowerCase()) ||
          (app.job.type || app.job.position || "").toLowerCase().includes(search.toLowerCase())
        ) : updatedApplications
      );
      
      setEditIndex(-1);
      alert(`Application status has been changed to ${newStatus}`);
    } catch (err) {
      console.error("Error updating application status:", err);
      alert("Failed to update application status. Please try again.");
    }
  };

  // View CV details
  const handleViewDetails = (app: Application) => {
    setViewingApp(app);
    setShowViewModal(true);
  };

  // Download CV file
  const handleDownloadCV = async (app: Application) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Authentication required. Please login.");
        router.push("/login");
        return;
      }
      
      // Show loading indicator
      setIsDownloading(app._id);
      
      // Use fetch instead of window.open to properly handle authentication
      const response = await fetch(`http://localhost:5000/api/applications/${app._id}/cv`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download CV error:", errorText);
        alert("Failed to download CV. Please ensure the file exists.");
        return;
      }
      
      // Get filename from response headers or use a default name
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'cv-document.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Convert response to blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading CV:", err);
      alert("Network error while downloading CV. Please try again.");
    } finally {
      setIsDownloading(null);
    }
  };

  // Handle application deletion
  const handleDeleteApplication = async (app: Application) => {
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/login");
          return;
        }
        
        const response = await fetch(`http://localhost:5000/api/applications/${app._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to delete application");
        }
        
        // Update local state
        const updatedApplications = applications.filter(a => a._id !== app._id);
        setApplications(updatedApplications);
        setFilteredApplications(
          search ? updatedApplications.filter(a => 
            a.nameWithInitials.toLowerCase().includes(search.toLowerCase()) ||
            (a.job.type || a.job.position || "").toLowerCase().includes(search.toLowerCase())
          ) : updatedApplications
        );
        
        alert("Application has been deleted successfully");
      } catch (err) {
        console.error("Error deleting application:", err);
        alert("Failed to delete application. Please try again.");
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

          {/* Loading or Error State */}
          {isLoading ? (
            <div className={styles.loadingContainer}>Loading applications...</div>
          ) : error ? (
            <div className={styles.errorContainer}>{error}</div>
          ) : (
            /* Applications Table */
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
                      <tr key={app._id}>
                        <td>{app.job?.type || app.job?.position || "Unknown Job"}</td>
                        <td>{app.nameWithInitials}</td>
                        <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
                          {editIndex === idx ? (
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app, e.target.value)}
                              style={{ fontSize: "15px", borderRadius: "8px", padding: "4px 8px" }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewing">Reviewing</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          ) : (
                            <span
                              className={
                                app.status === "Shortlisted" || app.status === "Accepted"
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
                            onClick={() => setEditIndex(idx)}
                          >
                            Edit
                          </button>
                          <button
                            className={`${viewerStyles.tableBtn} ${viewerStyles.tableDownloadBtn}`}
                            onClick={() => handleDownloadCV(app)}
                            disabled={isDownloading === app._id}
                          >
                            {isDownloading === app._id ? "Downloading..." : "📥 CV"}
                          </button>
                          <button
                            className={`${viewerStyles.tableBtn} ${viewerStyles.tableDeleteBtn}`}
                            onClick={() => handleDeleteApplication(app)}
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
          )}

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
                    <span>{viewingApp.job.type || viewingApp.job.position || "Unknown Job"}</span>
                    
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
                    
                    <strong>Submitted On:</strong>
                    <span>{new Date(viewingApp.createdAt).toLocaleDateString()}</span>
                    
                    <strong>Status:</strong>
                    <span className={`${viewerStyles.statusBadge} ${
                      viewingApp.status === "Shortlisted" || viewingApp.status === "Accepted" ? viewerStyles.statusShortlisted : 
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
                  <button 
                    onClick={() => handleDownloadCV(viewingApp)}
                    className={`${viewerStyles.btn} ${viewerStyles.btnSuccess}`}
                  >
                    <span className={viewerStyles.iconMargin}>📥</span> Download CV
                  </button>
                  
                  <button 
                    onClick={() => {
                      setEditIndex(filteredApplications.findIndex(app => app._id === viewingApp._id));
                      setShowViewModal(false);
                    }}
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