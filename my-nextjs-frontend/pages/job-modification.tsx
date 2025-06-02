import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";

type Job = {
  _id: string;
  jobId: string;
  field: string;
  dueDate: string;
  status: string;
  type: string;
  position: string;
  // Add other job fields as needed
};

export default function JobModification() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [router]);

  // Filter jobs based on search input
  useEffect(() => {
    if (search) {
      const filtered = jobs.filter((job) =>
        job.jobId.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [search, jobs]);

  // Handle job status change
  const handleStatusChange = async (job: Job, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/jobs/${job._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update job status");
      }

      // Update local state after successful API call
      const updatedJobs = jobs.map((j) =>
        j._id === job._id ? { ...j, status: newStatus } : j
      );

      setJobs(updatedJobs);
      setFilteredJobs(
        search
          ? updatedJobs.filter((j) =>
              j.jobId.toLowerCase().includes(search.toLowerCase())
            )
          : updatedJobs
      );
      setEditIndex(-1);

      // Show confirmation to user
      alert(`Job status has been changed to ${newStatus}`);
    } catch (err) {
      console.error("Error updating job status:", err);
      alert("Failed to update job status. Please try again.");
    }
  };

  // Handle job deletion
  const handleDelete = async (job: Job) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          alert("Authentication required. Please login again.");
          router.push("/login");
          return;
        }
        
        const response = await fetch(`http://localhost:5000/api/jobs/${job._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Check content type before attempting to parse JSON
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
          // Handle non-JSON error responses
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Server returned non-JSON response:', text);
            alert("Error: Unable to delete job. Please try again later.");
            return;
          }
          
          // Parse JSON error
          const errorData = await response.json();
          alert(errorData.error || "Failed to delete job. Please try again.");
          return;
        }
        
        // Success case - update local state
        const updatedJobs = jobs.filter((j) => j._id !== job._id);
        setJobs(updatedJobs);
        setFilteredJobs(
          search
            ? updatedJobs.filter((j) =>
                j.jobId.toLowerCase().includes(search.toLowerCase())
              )
            : updatedJobs
        );
        
        // Show success message
        alert("Job deleted successfully");
        
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Network error while deleting job. Please check your connection and try again.");
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
              <span className={styles.triangle} />▶ Job Creation
            </div>
            <div className={`${styles.menuItem} ${styles.menuItemActive}`}>
              <span className={styles.triangle} />▶ Job Modification
            </div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/received-cvs")}
              style={{ cursor: "pointer" }}
            >
              <span className={styles.triangle} />▶ Received CVs
            </div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/accepted-cvs")}
              style={{ cursor: "pointer" }}
            >
              <span className={styles.triangle} />▶ Accepted CVs
            </div>
          </div>
        </aside>

        <main className={styles.content}>
          {/* Search Bar */}
          <div className={styles.jobModSearchRow}>
            <input
              className={styles.jobModSearchInput}
              type="text"
              placeholder="Search by Job ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>Loading jobs...</p>
            </div>
          ) : (
            /* Jobs Table */
            <div className={styles.jobModTableWrapper}>
              <table className={styles.jobModTable}>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Job Field</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Modification</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={5}>No jobs found.</td>
                    </tr>
                  ) : (
                    filteredJobs.map((job, idx) => (
                      <tr key={job._id}>
                        <td>{job.jobId}</td>
                        <td>{job.field}</td>
                        <td>{job.dueDate}</td>
                        <td>
                          {editIndex === idx ? (
                            <select
                              value={job.status}
                              onChange={(e) =>
                                handleStatusChange(job, e.target.value)
                              }
                              style={{
                                fontSize: "15px",
                                borderRadius: "8px",
                                padding: "4px 8px",
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          ) : (
                            <span
                              className={
                                job.status === "Accepted"
                                  ? styles.accepted
                                  : job.status === "Rejected"
                                  ? styles.jobModRejected
                                  : styles.jobModPending
                              }
                            >
                              {job.status}
                            </span>
                          )}
                        </td>
                        <td>
                          <img
                            src="/edit.png"
                            alt="Edit"
                            className={styles.jobModIcon}
                            style={{ cursor: "pointer" }}
                            onClick={() => setEditIndex(idx)}
                          />
                          <img
                            src="/delete.png"
                            alt="Delete"
                            className={styles.jobModIcon}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(job)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}