import React from "react";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css"; // Import Home styles


export default function JobCreation() {
  return (
    <>
      {/* Top Navbar */}
      <header className={homeStyles.topBar}>
        <img src="/logo.png" alt="Logo" className={homeStyles.logo} />
        <span className={homeStyles.title}>Training Program</span>
        <nav className={homeStyles.nav}>
          <a href="/">Home</a>
          <span>|</span>
          <a href="/logout">Logout</a>
        </nav>
      </header>

      {/* Main content area with sidebar and page content */}
      <div className={styles.bg}>
        <aside className={styles.sidebar}>
          <div className={styles.menu}>
            <div className={styles.menuItemActive}>▶ Job Creation</div>
            <div className={styles.menuItem}>▶ Job Modification</div>
            <div className={styles.menuItem}>▶ Received CVs</div>
            <div className={styles.menuItem}>▶ Accepted CVs</div>
          </div>
        </aside>
        <main className={styles.content}>
          <div className={styles.formCard}>
            <h2 className={styles.heading}>Company Job Vacancy : Web Development Trainee</h2>
            <form className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Job ID :</label>
                  <input type="text" />
                </div>
                <div className={styles.field}>
                  <label>Job Position :</label>
                  <input type="text" />
                </div>
                <div className={styles.field}>
                  <label>Contact Number :</label>
                  <input type="text" />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Job Field :</label>
                  <input type="text" />
                </div>
                <div className={styles.field}>
                  <label>Salary :</label>
                  <input type="text" />
                </div>
                <div className={styles.field}>
                  <label>Due Date:</label>
                  <input type="date" />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Background :</label>
                  <input type="text" />
                </div>
                <div className={styles.field}>
                  <label>Company Location :</label>
                  <input type="text" />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Company Email:</label>
                  <input type="email" />
                </div>
                <div className={styles.field}>
                  <label>Work Type:</label>
                  <input type="text" />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.fieldWide}>
                  <label>Job Description :</label>
                  <textarea rows={3} />
                </div>
              </div>
              <div className={styles.buttonRow}>
                <button type="submit" className={styles.createBtn}>Create</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}