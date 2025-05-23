import React, { useRef, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Apply() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCvFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

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

        <form className={styles.applyForm}>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Job Title :</label>
            <span className={styles.formValue}>Web Development Trainee</span>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Name with Initials:</label>
            <input className={styles.formInput} type="text" />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Full Name :</label>
            <input className={styles.formInput} type="text" />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Gender :</label>
            <select className={styles.formInput}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Date of Birth :</label>
            <input className={styles.formInput} type="date" />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Email :</label>
            <input className={styles.formInput} type="email" />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Contact Number :</label>
            <input className={styles.formInput} type="tel" />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Field :</label>
            <select className={styles.formInput}>
              <option value="">Select</option>
              <option value="it">IT</option>
              <option value="engineering">Engineering</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Upload your CV here</label>
            <div
              className={styles.uploadBox}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                borderColor: dragActive ? '#0055A2' : '#bbb',
                background: dragActive ? '#e6f0fa' : '#fff'
              }}
            >
              <input
                type="file"
                className={styles.fileInput}
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <div className={styles.uploadText}>
                {cvFile ? (
                  <div>
                    <strong>Selected file:</strong> {cvFile.name}
                  </div>
                ) : (
                  <>
                    <div>Drag&Drop files here</div>
                    <div>or</div>
                    <button
                      type="button"
                      className={styles.browseBtn}
                      onClick={handleBrowseClick}
                    >
                      Browse Files
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}