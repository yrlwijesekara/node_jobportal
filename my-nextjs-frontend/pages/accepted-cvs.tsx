import React from "react";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const acceptedCVs = [
  {
    jobTitle: "Software",
    name: "QA Trainee",
    gender: "",
    field: "",
    contact: "",
    cv: "",
  },
  {
    jobTitle: "Telecommunication",
    name: "Trainee",
    gender: "",
    field: "",
    contact: "",
    cv: "",
  },
];

export default function AcceptedCVs() {
  const router = useRouter();

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
                {acceptedCVs.map((cv, idx) => (
                  <tr key={idx}>
                    <td>{cv.jobTitle}</td>
                    <td>{cv.name}</td>
                    <td>{cv.gender}</td>
                    <td>{cv.field}</td>
                    <td>{cv.contact}</td>
                    <td>{cv.cv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}