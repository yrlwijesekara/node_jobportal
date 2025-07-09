import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

// Type definition for job objects
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

export default function Jobs() {
    const router = useRouter();
    const [acceptedJobs, setAcceptedJobs] = useState<Job[]>([]);
    const [allJobs, setAllJobs] = useState<Job[]>([]); 
    const [selectedType, setSelectedType] = useState(""); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Get unique job types from the jobs list
    const jobTypes = [...new Set(acceptedJobs.map(job => job.type))].filter(Boolean);

    // Load jobs from the API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setIsLoading(true);
                // Fetch jobs from API - use the public or latest endpoint
                const response = await fetch('http://localhost:5000/api/jobs/public');
                
                if (!response.ok) {
                    // Instead of throwing, handle the error gracefully
                    const errorText = await response.text();
                    console.error(`API Error (${response.status}):`, errorText);
                    setError(`Failed to load jobs: ${response.status}`);
                    setIsLoading(false);
                    return; // Exit early
                }
                
                const data = await response.json();
                console.log("Jobs from API:", data.jobs);
                
                if (!data.jobs || !Array.isArray(data.jobs)) {
                    console.error("Invalid data format:", data);
                    setError("Invalid data received from server");
                    setIsLoading(false);
                    return;
                }
                
                // Filter for accepted jobs only (if needed)
                const accepted = data.jobs.filter((job: Job) => job.status === "Accepted");
                console.log("Filtered accepted jobs:", accepted);
                
                setAllJobs(accepted);
                setAcceptedJobs(accepted);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Network error. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchJobs();
    }, []);

    // Handle job type filter change
    const handleFilterChange = (e: { target: { value: string; }; }) => {
        const type = e.target.value;
        setSelectedType(type);

        if (type === "") {
            // If no filter, show all jobs
            setAcceptedJobs(allJobs);
        } else {
            // Filter jobs by selected type
            const filtered = allJobs.filter(job => job.type === type);
            setAcceptedJobs(filtered);
        }
    };

    return (
        <div className={styles.container}>
            {/* Top Section with Navbar */}
            <div className={styles.topSection}>
                <header className={styles.topBar}>
                    <img src="/logo.png" alt="Logo" className={styles.logo} />
                    <span className={styles.title}>Training Program</span>
                    <nav className={styles.nav}>
                        <a href="/job-status">Job status</a>
                        <span>|</span>
                        <a href="/jobs" className={styles.active}>Jobs</a>
                        <span>|</span>
                        <a href="/vacancies">Jobs for you</a>
                        <span>|</span>
                        <a href="/">Home</a>
                        <span>|</span>
                        <a href="/login">Login</a>
                    </nav>
                </header>

                {/* Banner */}
                <section className={styles.banner}>
                    <img src="/mobitel.png" alt="Banner" className={styles.bannerImg} />
                </section>
            </div>

            {/* Search Filter */}
            <div style={{
                padding: "20px",
                display: "flex",
                justifyContent: "center",
                margin: "20px 0"
            }}>
                <div style={{
                    maxWidth: "600px",
                    width: "100%",
                    textAlign: "center"
                }}>
                    <label htmlFor="jobType" style={{
                        fontWeight: "bold",
                        marginRight: "10px",
                        fontSize: "18px",
                        color: "#0055A2"
                    }}>
                        Filter by Job Type:
                    </label>
                    <select
                        id="jobType"
                        value={selectedType}
                        onChange={handleFilterChange}
                        style={{
                            padding: "10px 15px",
                            borderRadius: "8px",
                            border: "2px solid #0055A2",
                            fontSize: "16px",
                            minWidth: "250px",
                            cursor: "pointer"
                        }}
                    >
                        <option value="">All Job Types</option>
                        {jobTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Cards Section */}
            <section className={styles.cards} style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)", // Changed to 3 columns
                gap: "30px",
                padding: "0 20px 40px",
                justifyItems: "center",
            }}>
                <h1 style={{
                    textAlign: 'center',
                    margin: '30px 0',
                    color: '#0055A2',
                    gridColumn: "1 / span 3", // Changed to span 3
                    fontSize: "32px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #0055A2",
                    paddingBottom: "15px",
                    width: "80%",
                    justifySelf: "center"
                }}>
                    {selectedType ? `${selectedType} Positions` : "Available Job Positions"}
                </h1>

                {isLoading ? (
                    <div style={{ textAlign: 'center', gridColumn: "1 / span 3" }}>
                        <p>Loading jobs...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', gridColumn: "1 / span 3", color: "red" }}>
                        <p>{error}</p>
                    </div>
                ) : acceptedJobs.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        padding: '20px',
                        gridColumn: "1 / span 3"
                    }}>
                        {selectedType
                            ? `No ${selectedType} positions available at the moment.`
                            : "No job positions available at the moment. Please check back later."}
                    </p>
                ) : (
                    // Map jobs to cards
                    acceptedJobs.map((job, index) => (
                        <div key={job._id} className={styles.card} style={{
                            overflow: "hidden",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <div className={styles.cardHeader}>
                                {job.type || job.position || "Job Position"}
                            </div>
                            <div className={styles.cardBody} style={{
                                overflow: "hidden",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                flex: 1
                            }}>
                                <p style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    wordBreak: "break-word"
                                }}>
                                    {job.description || "No description available for this position."}
                                </p>
                                <ul style={{ paddingLeft: "20px" }}>
                                    {job.field && <li><strong>Field:</strong> {job.field}</li>}
                                    {job.background && <li><strong>Required Background:</strong> {job.background}</li>}
                                    {job.workType && <li><strong>Work Type:</strong> {job.workType}</li>}
                                    {job.location && <li><strong>Location:</strong> {job.location}</li>}
                                    {job.salary && <li><strong>Salary:</strong> {job.salary}</li>}
                                    {job.dueDate && <li><strong>Deadline:</strong> {job.dueDate}</li>}
                                </ul>
                            </div>
                            <button className={styles.applyBtn} onClick={() => router.push(`/apply?jobId=${job._id}`)}>
                                Apply Now
                            </button>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}