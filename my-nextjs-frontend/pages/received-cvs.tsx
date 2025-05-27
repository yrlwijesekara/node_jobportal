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
};

export default function ReceivedCVs() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  // Load applications from localStorage on component mount
  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]");
    setApplications(savedApplications);
    setFilteredApplications(savedApplications);
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
    alert(`
      Job: ${app.jobTitle}
      Name: ${app.fullName}
      Email: ${app.email}
      Contact: ${app.contactNumber}
      Field: ${app.field}
      CV: ${app.cvFileName || "No file"}
      Submitted: ${new Date(app.submissionDate).toLocaleDateString()}
    `);
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}