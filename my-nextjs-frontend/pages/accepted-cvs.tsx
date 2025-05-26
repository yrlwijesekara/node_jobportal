import React from "react";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { useJobs } from "../context/JobsContext";

export default function AcceptedCVs() {
  const router = useRouter();
  const { jobs } = useJobs();
  const acceptedJobs = jobs.filter((job: { status: string; }) => job.status === "Accepted");

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
            <div
              className={styles.menuItem}
              onClick={() => router.push("/job-modification")}
              style={{ cursor: "pointer" }}
            >
              <span className={styles.triangle} /> ▶ Job Modification
            </div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/received-cvs")}
              style={{ cursor: "pointer" }}
            >
              <span className={styles.triangle} />▶ Received CVs
            </div>
            <div className={`${styles.menuItem} ${styles.menuItemActive}`}>
              <span className={styles.triangle} />▶ Accepted CVs
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.content}>
          <div className={styles.acceptedCvsCard}>
            <h2 className={styles.acceptedCvsTitle}>Accepted CVs</h2>
            <table className={styles.acceptedCvsTable}>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Field</th>
                  <th>Contact Number</th>
                  <th>CV</th>
                </tr>
              </thead>
              <tbody>
                {acceptedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No accepted CVs found.</td>
                  </tr>
                ) : (
                  acceptedJobs.map((job: { jobTitle: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; gender: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; field: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; contact: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; cv: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, idx: React.Key | null | undefined) => (
                    <tr key={idx}>
                      <td>{job.jobTitle}</td>
                      <td>{job.name}</td>
                      <td>{job.gender}</td>
                      <td>{job.field}</td>
                      <td>{job.contact}</td>
                      <td>
                        <a
                          href={`/${job.cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {job.cv}
                        </a>
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