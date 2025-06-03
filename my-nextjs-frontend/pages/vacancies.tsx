import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

// Job type definition
type Job = {
  _id: string;
  jobId: string;
  type: string;
  field: string;
  dueDate: string;
  position: string;
  contactNumber?: string;
  salary?: string;
  background?: string;
  location?: string;
  email?: string;
  workType?: string;
  description?: string;
  status: string;
  createdAt: string;
};

export default function Vacancies() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        
        // Use the latest endpoint to get the 4 most recent jobs
        const response = await fetch('http://localhost:5000/api/jobs/latest');
        
        if (!response.ok) {
          // Instead of throwing an error, handle it gracefully
          const errorText = await response.text();
          console.error(`API Error (${response.status}):`, errorText);
          setError(`Failed to load jobs: ${response.status}`);
          setIsLoading(false);
          return; // Exit early
        }
        
        const data = await response.json();
        console.log("Latest jobs:", data.jobs);
        
        if (!data.jobs || !Array.isArray(data.jobs)) {
          console.error("Invalid data format:", data);
          setError("Invalid data received from server");
          setIsLoading(false);
          return;
        }
        
        // No need to filter - backend already returns only accepted jobs
        setJobs(data.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Network error while loading jobs. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

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
            <a href="/jobs">Jobs</a>
            <span>|</span>
            <a href="/vacancies" className={styles.active}>Jobs for you</a>
            <span>|</span>
            <a href="/">Home</a>
            <span>|</span>
            <a href="/login">Login</a>
          </nav>
        </header>

        {/* Heading */}
        <h1 className={styles.vacanciesHeading}>
          Find Your Job that is prefer for you
        </h1>

        {/* Loading or Error State */}
        {isLoading ? (
          <div className={styles.loadingContainer}>Loading jobs...</div>
        ) : error ? (
          <div className={styles.errorContainer}>{error}</div>
        ) : (
          <>
            {/* Cards Section */}
            <section className={styles.cards}>
              {jobs.length === 0 ? (
                <p className={styles.noJobs}>No job positions available at the moment.</p>
              ) : (
                jobs.map(job => (
                  <div key={job._id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      {job.type || job.position || "Job Position"}
                    </div>
                    <div className={styles.cardBody}>
                      <p>
                        {job.description || "No description available for this position."}
                      </p>
                      <ul>
                        {job.background && (
                          <li>{job.background}</li>
                        )}
                        {job.field && (
                          <li>Field: {job.field}</li>
                        )}
                        {job.workType && (
                          <li>Work Type: {job.workType}</li>
                        )}
                        {job.location && (
                          <li>Location: {job.location}</li>
                        )}
                        {job.dueDate && (
                          <li>Application deadline: {job.dueDate}</li>
                        )}
                      </ul>
                    </div>
                    <button 
                      className={styles.applyBtn} 
                      onClick={() => router.push(`/apply?jobId=${job._id}`)}
                    >
                      Apply Now
                    </button>
                  </div>
                ))
              )}
            </section>
          </>
        )}

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