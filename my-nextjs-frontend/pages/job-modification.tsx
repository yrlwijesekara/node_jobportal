import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";

type Job = {
  id: string;
  field: string;
  date: string;
  status?: string;
};

export default function JobModification() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  // Load jobs from localStorage on component mount
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(savedJobs);
    setFilteredJobs(savedJobs);
  }, []);

  // Filter jobs based on search input
  useEffect(() => {
    if (search) {
      const filtered = jobs.filter((job) =>
        job.id.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [search, jobs]);

  // Handle job status change
  const handleStatusChange = (index: number, newStatus: string) => {
    console.log("Changing job status:", index, "to", newStatus);

    const updatedJobs = [...jobs];
    updatedJobs[index].status = newStatus; // Make sure status is exactly "Accepted" or "Rejected"

    console.log("Updated job:", updatedJobs[index]);
    setJobs(updatedJobs);

    // Make sure localStorage is updated correctly
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setEditIndex(-1);

    // Show confirmation to user
    alert(`Job status has been changed to ${newStatus}`);
  };

  // Handle job deletion
  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this job?")) {
      const updatedJobs = jobs.filter((_, i) => i !== index);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
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

          {/* Jobs Table */}
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
                    <tr key={idx}>
                      <td>{job.id}</td>
                      <td>{job.field}</td>
                      <td>{job.date}</td>
                      <td>
                        {editIndex === jobs.indexOf(job) ? (
                          <select
                            value={job.status ?? ""}
                            onChange={(e) =>
                              handleStatusChange(jobs.indexOf(job), e.target.value)
                            }
                            style={{
                              fontSize: "15px",
                              borderRadius: "8px",
                              padding: "4px 8px",
                            }}
                          >
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span
                            className={
                              job.status === "Accepted"
                                ? styles.accepted
                                : styles.jobModRejected
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
                          onClick={() => setEditIndex(jobs.indexOf(job))}
                        />
                        <img
                          src="/delete.png"
                          alt="Delete"
                          className={styles.jobModIcon}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(jobs.indexOf(job))}
                        />
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