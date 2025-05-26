import React, { useState } from "react";
import { useRouter } from "next/router";
import { useJobs } from "../context/JobsContext";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";

export default function JobModification() {
  const router = useRouter();
  const { jobs, setJobs } = useJobs();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const handleStatusChange = (idx: number, newStatus: string) => {
    setJobs((jobs: any[]) =>
      jobs.map((job, i) =>
        i === idx ? { ...job, status: newStatus } : job
      )
    );
    setEditIndex(null); // Hide select after change
  };

  const handleDelete = (idx: number) => {
    setJobs((jobs: any[]) => jobs.filter((_, i) => i !== idx));
  };

  // Filter jobs by Job ID (case-insensitive, partial match)
  const filteredJobs = jobs.filter((job: { id: string; }) =>
    job.id.toLowerCase().includes(search.trim().toLowerCase())
  );

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
              <span className={styles.triangle} />▶ Job creation
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

        {/* Main Content */}
        <main className={styles.content}>
          {/* Search Bar */}
          <div className={styles.jobModSearchRow}>
            <input
              className={styles.jobModSearchInput}
              type="text"
              placeholder="Search by Job ID"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className={styles.jobModSearchBtn}>
              <img src="/search.png" alt="Search" />
            </button>
          </div>

          {/* Table */}
          <div className={styles.jobModTableWrapper}>
            <table className={styles.jobModTable}>
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Job Field</th>
                  <th>Created Date</th>
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
                  filteredJobs.map((job: { id: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; field: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; date: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, idx: React.Key | null | undefined) => (
                    <tr key={idx}>
                      <td>{job.id}</td>
                      <td>{job.field}</td>
                      <td>{job.date}</td>
                      <td>
                        {editIndex === jobs.indexOf(job) ? (
                          <select
                            value={job.status ?? ""}
                            onChange={e => handleStatusChange(jobs.indexOf(job), e.target.value)}
                            style={{ fontSize: "15px", borderRadius: "8px", padding: "4px 8px" }}
                          >
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span className={job.status === "Accepted" ? styles.accepted : styles.jobModRejected}>
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