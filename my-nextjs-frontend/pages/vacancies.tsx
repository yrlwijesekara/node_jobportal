import React from 'react';
import styles from '../styles/Home.module.css';

export default function Vacancies() {
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
            <a href="/" >Home</a>
            <span>|</span>
            <a href="/login">Login</a>
          </nav>
        </header>

        {/* Heading */}
        <h1 className={styles.vacanciesHeading}>
          Find Your Job that is prefer for you
        </h1>

        {/* Cards Section */}
        <section className={styles.cards}>
          {/* Card 1 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>Trainee Network Engineers</div>
            <div className={styles.cardBody}>
              <p>
                We are hiring new training network engineers for SLTMobitel, Only an associate degree, a bachelor’s degree in computer science, information technology, computer engineering, or a related field undergraduates (3rd year, 4th year), and fresh graduates are proffered.
              </p>
              <ul>
                <li>No job experiences are needed.</li>
                <li>Networking knowledge.</li>
                <li>Operating systems knowledge.</li>
                <li>Network devices and security knowledge.</li>
                <li>Networking device configuration knowledge.</li>
              </ul>
            </div>
            <button className={styles.applyBtn}>Apply Now</button>
          </div>
          {/* Card 2 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>ACCOUNTANT-FINANCIAL ACCOUNTING</div>
            <div className={styles.cardBody}>
              <p>
                Sri Lanka Telecom is in search of high caliber, result-oriented and qualified individuals capable of playing a key role in the finance team...
              </p>
              <ul>
                <li>Associate Membership of ICA/CIMA/ACCA</li>
                <li>Preference will be given to the candidates who are prize winners.</li>
                <li>Be a resilient leader with excellent interpersonal and communication skills.</li>
              </ul>
            </div>
            <button className={styles.applyBtn}>Apply Now</button>
          </div>
          {/* Card 3 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>ENGINEERS</div>
            <div className={styles.cardBody}>
              <p>
                As an Engineer of the pioneering ICT solutions provider, you will be a distinguished member of our team...
              </p>
              <ul>
                <li>Four-year Degree in BSc Engineering/ Bachelor of Technology...</li>
                <li>Thorough knowledge and experience in the field of Data Centre Network Security...</li>
              </ul>
            </div>
            <button className={styles.applyBtn}>Apply Now</button>
          </div>
          {/* Card 4 */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>TECHNICIANS</div>
            <div className={styles.cardBody}>
              <p>
                Technicians are mainly responsible in install, maintain and repair electronic communications equipment...
              </p>
              <ul>
                <li>06 passes at the G.C.E. (O/L) exam including Sinhala Tamil and English Language and Mathematics and 03 credit passes in one sitting AND
</li>
                <li>Should have obtained Skilled Competence Certificate -NAITA in the relevant field equivalent to NVQ Level 4 (Telecommunication / Electrical/Electronic/ ICT/Power / Air Conditioning etc). </li>
              </ul>
            </div>
            <button className={styles.applyBtn}>Apply Now</button>
          </div>
        </section>

        {/* Apply Job Status Button */}
        <div className={styles.statusBtnContainer}>
          <a href="/job-status" className={styles.statusBtn}>
            Check the Applied Job Status
          </a>
        </div>
      </div>
    </div>
  );
}