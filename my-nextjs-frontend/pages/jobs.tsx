import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Jobs() {
    const router = useRouter();
    const [acceptedJobs, setAcceptedJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]); // Store all jobs
    const [selectedType, setSelectedType] = useState(""); // For job type filter

    // Get unique job types from the jobs list
    const jobTypes = [...new Set(acceptedJobs.map(job => job.type))].filter(Boolean);

    // Load jobs and debug the process
    useEffect(() => {
        // Get all jobs from localStorage
        const savedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
        console.log("All jobs from localStorage:", savedJobs);

        // Filter for accepted jobs only - case sensitive!
        const accepted = savedJobs.filter((job: { status: string; }) => job.status === "Accepted");
        console.log("Filtered accepted jobs:", accepted);

        setAllJobs(accepted); // Store all accepted jobs
        setAcceptedJobs(accepted); // Initially show all
    }, []);

    // Handle job type filter change
    const handleFilterChange = (e: { target: { value: any; }; }) => {
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
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "50px",
                padding: "0 20px 40px",
                justifyItems: "center",  // Centers items in each grid cell
                
            }}>
                <h1 style={{
                    textAlign: 'center',
                    margin: '30px 0',
                    color: '#0055A2',
                    gridColumn: "1 / span 3",  // This makes the heading span all 3 columns
                    fontSize: "32px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #0055A2",
                    paddingBottom: "15px",
                    width: "80%",
                    justifySelf: "center"  // Centers the element within its grid cell
                }}>
                    {selectedType ? `${selectedType} Positions` : "Available Job Positions"}
                </h1>

                {acceptedJobs.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        padding: '20px',
                        gridColumn: "1 / span 3"  // Make the message span all columns
                    }}>
                        {selectedType
                            ? `No ${selectedType} positions available at the moment.`
                            : "No job positions available at the moment. Please check back later."}
                    </p>
                ) : (
                    // Map directly in the grid, no need for additional container
                    acceptedJobs.map((job, index) => (
                        <div key={index} className={styles.card} style={{
                            overflow: "hidden",
                            height: "100%",  // Makes all cards the same height
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
                                flex: 1  // Makes body take available space
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
                                    {job.date && <li><strong>Deadline:</strong> {job.date}</li>}
                                </ul>
                            </div>
                            <button className={styles.applyBtn} onClick={() => router.push(`/apply?jobId=${job.id}`)}>
                                Apply Now
                            </button>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}