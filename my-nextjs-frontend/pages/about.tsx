import React from 'react';
import styles from '../styles/Home.module.css'; // Use the same CSS as index for nav

export default function About() {
  return (
    <div className={styles.container}>
      {/* Top Navigation Bar (reuse from index) */}
      <header className={styles.topBar}>
        <img src="/logo.png" alt="Logo" className={styles.logo} />
        <span className={styles.title}>Training Program</span>
        <nav className={styles.nav}>
          <a href="/">Home</a>
          <span>|</span>
          <a href="/about">About Us</a>
          <span>|</span>
          <a href="/vacancies">Vacancies</a>
          <span>|</span>
          <a href="/login">Login</a>
        </nav>
      </header>

      {/* About Us Content */}
      <section className={styles.aboutSection}>
        <h1 className={styles.aboutTitle}>About Us</h1>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            "Welcome to [Your Company Name], where innovation meets passion.
            Established with a commitment to [briefly mention your mission or
            purpose], we strive to [highlight key values or goals]. Our dedicated
            team of [mention your team's expertise] is driven by a shared vision:
            [describe the overarching goal or impact]. At [Your Company Name], we
            believe in [mention any unique approach or philosophy]. Join us on
            this exciting journey as we [briefly describe what sets your company
            apart]."
          </div>
          <div className={styles.aboutImageBox}>
            <img
              src="/aboutus.png"
              alt="About Us"
              className={styles.aboutImage}
            />
          </div>
        </div>
        <a href="#" className={styles.learnMoreBtn}>
          Learn more
        </a>
      </section>
    </div>
  );
}