import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";

// Updated type to match MongoDB schema
type Application = {
  _id: string;
  nameWithInitials: string;
  fullName: string;
  email: string;
  contactNumber: string;
  field: string;
  cvFilePath: string;
  submissionDate?: string;
  createdAt: string;
  status: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewLocation?: string;
  interviewNotes?: string;
  job: {
    _id: string;
    jobId: string;
    type: string;
    position: string;
  };
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load shortlisted applications from API on component mount
  useEffect(() => {
    const fetchShortlistedApplications = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Authentication required. Please log in.");
          router.push("/login");
          return;
        }
        
        const response = await fetch("http://localhost:5000/api/applications/shortlisted", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Handle non-200 responses without throwing errors
        if (!response.ok) {
          // Try to extract error message from response
          let errorMessage = "Failed to fetch shortlisted applications";
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
        setShortlistedApplications(data.applications);
        setFilteredApplications(data.applications);
      } catch (err) {
        console.error("Error fetching shortlisted applications:", err);
        setError("Failed to load shortlisted applications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShortlistedApplications();
  }, [router]);

  // Filter applications based on search input
  useEffect(() => {
    if (search) {
      const filtered = shortlistedApplications.filter((app) =>
        app.nameWithInitials.toLowerCase().includes(search.toLowerCase()) ||
        (app.job?.type || app.job?.position || "").toLowerCase().includes(search.toLowerCase())
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

  // Save interview details to API
  const handleSaveInterview = async () => {
    if (!currentApp) return;
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Authentication required. Please log in again.");
        router.push("/login");
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/applications/${currentApp._id}/interview`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          interviewDate: interviewDetails.date,
          interviewTime: interviewDetails.time,
          interviewLocation: interviewDetails.location,
          interviewNotes: interviewDetails.notes
        })
      });
      
      // Handle non-OK responses without throwing errors
      if (!response.ok) {
        let errorMessage = "Failed to schedule interview";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use the default error message
        }
        
        console.error(`API Error (${response.status}): ${errorMessage}`);
        alert(errorMessage);
        return; // Exit early instead of throwing
      }
      
      // Update local state with the new interview details
      const updatedApplications = shortlistedApplications.map(app => {
        if (app._id === currentApp._id) {
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
      
      setShortlistedApplications(updatedApplications);
      setFilteredApplications(
        search 
          ? updatedApplications.filter(app => 
              app.nameWithInitials.toLowerCase().includes(search.toLowerCase()) ||
              (app.job?.type || app.job?.position || "").toLowerCase().includes(search.toLowerCase())
            )
          : updatedApplications
      );
      
      setShowModal(false);
      setCurrentApp(null);
      alert("Interview scheduled successfully!");
    } catch (err) {
      // This will now only catch network errors or other unexpected exceptions
      console.error("Error scheduling interview:", err);
      alert("Network error while scheduling interview. Please check your connection and try again.");
    }
  };

  // View detailed CV info
  const handleViewDetails = (app: Application) => {
    setViewingApp(app);
    setShowViewModal(true);
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

          {/* Loading and Error States */}
          {isLoading ? (
            <div className={styles.loadingContainer}>Loading shortlisted applications...</div>
          ) : error ? (
            <div className={styles.errorContainer}>{error}</div>
          ) : (
            /* Shortlisted Applications Table */
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
                    filteredApplications.map((app) => (
                      <tr key={app._id}>
                        <td>{app.job?.type || app.job?.position || "Unknown Job"}</td>
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
          )}
          
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
                    <span>{viewingApp.job?.type || viewingApp.job?.position || "Unknown Job"}</span>
                    
                    <strong>Applicant Name:</strong>
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
                  
                  {viewingApp.interviewDate && (
                    <>
                      <h4 style={{ borderBottom: "1px solid #ddd", paddingBottom: "5px", marginTop: "20px" }}>
                        Interview Details
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", rowGap: "10px" }}>
                        <strong>Date:</strong>
                        <span>{viewingApp.interviewDate}</span>
                        
                        <strong>Time:</strong>
                        <span>{viewingApp.interviewTime}</span>
                        
                        <strong>Location:</strong>
                        <span>{viewingApp.interviewLocation}</span>
                        
                        <strong>Notes:</strong>
                        <span style={{whiteSpace: "pre-wrap"}}>{viewingApp.interviewNotes || "None"}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
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