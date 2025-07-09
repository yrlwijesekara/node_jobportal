import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

type Job = {
  _id: string;
  jobId: string;
  type: string;
  field: string;
  dueDate: string;
  position: string;
  description?: string;
  location?: string;
  salary?: string;
  workType?: string;
  background?: string;
  status: string;
  createdAt?: string;
};

export default function LatestJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/jobs/latest');
        
        if (!response.ok) {
          throw new Error('Failed to fetch latest jobs');
        }
        
        const data = await response.json();
        // Only keep the latest 6 jobs
        setJobs((data.jobs || []).slice(0, 6));
      } catch (err) {
        console.error('Error fetching latest jobs:', err);
        setError('Failed to load latest job opportunities');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  if (isLoading) return <div className={styles.loadingContainer}>Loading latest opportunities...</div>;

  return (
    <section className={styles.jobSection}>
      <h1 className={styles.sectionTitle}>Latest Job Opportunities</h1>
      
      {error ? (
        <div className={styles.errorContainer}>{error}</div>
      ) : jobs.length === 0 ? (
        <p className={styles.noJobs}>No job positions available at the moment.</p>
      ) : (
        <div className={styles.cards}>
          {jobs.map((job) => (
            <div key={job._id} className={styles.card}>
              <div className={styles.cardHeader}>
                {job.type || job.position || "Job Position"}
              </div>
              <div className={styles.cardBody}>
                <p className={styles.jobDescription}>
                  {job.description?.substring(0, 120) || "No description available for this position."}
                  {job.description && job.description.length > 120 ? "..." : ""}
                </p>
                <ul className={styles.jobDetails}>
                  {job.field && <li><strong>Field:</strong> {job.field}</li>}
                  {job.background && <li><strong>Required Background:</strong> {job.background}</li>}
                  {job.workType && <li><strong>Work Type:</strong> {job.workType}</li>}
                  {job.location && <li><strong>Location:</strong> {job.location}</li>}
                  {job.salary && <li><strong>Salary:</strong> {job.salary}</li>}
                  {job.dueDate && <li><strong>Deadline:</strong> {job.dueDate}</li>}
                </ul>
              </div>
              <button 
                className={styles.applyBtn}
                onClick={() => router.push(`/apply?jobId=${job._id}`)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.viewAllContainer}>
        <button 
          className={styles.viewAllBtn}
          onClick={() => router.push('/jobs')}
        >
          View All Opportunities
        </button>
      </div>
    </section>
  );
}