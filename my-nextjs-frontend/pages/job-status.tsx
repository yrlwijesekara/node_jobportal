import React from 'react';
import styles from '../styles/Home.module.css';

export default function JobStatus() {
  return (
    <div className={styles.vacanciesBg}>
      <div className={styles.container}>
        {/* Top Navigation Bar */}
        <header className={styles.topBar}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <span className={styles.title}>Training Program</span>
          <nav className={styles.nav}>
            <a href="/job-status">Job status</a>
            <span>|</span>
            <a href="/apply">Apply for job</a>
            <span>|</span>
            <a href="/vacancies">jobs for you</a>
            <span>|</span>
            <a href="/">Home</a>
            <span>|</span>
            <a href="/login">Login</a>
          </nav>
        </header>

        {/* Main Content */}
        <div className={styles.statusCard}>
          <h1 className={styles.statusHeading}>Applied Job Status:</h1>
          <table className={styles.statusTable}>
            <thead>
              <tr>
                <th>Job Field</th>
                <th>Job Position</th>
                <th>Recommendation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Software</td>
                <td>QA Trainee</td>
                <td>Approved yesterday</td>
                <td>Approved</td>
              </tr>
              <tr>
                <td>Telecommunication</td>
                <td>Trainee</td>
                <td>Rejected yesterday</td>
                <td>Rejected</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}