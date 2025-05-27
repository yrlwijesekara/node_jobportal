import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/JobCreation.module.css";
import homeStyles from "../styles/Home.module.css";

export default function JobCreation() {
  const router = useRouter();

  // Form state
  const [jobType, setJobType] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobField, setJobField] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [salary, setSalary] = useState("");
  const [background, setBackground] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [workType, setWorkType] = useState("");
  const [description, setDescription] = useState("");

  // Sample job options
  const jobTypes = [
    "Trainee Network Engineers",
    "ENGINEERS",
    "TECHNICIANS",
    "ACCOUNTANT-FINANCIAL ACCOUNTING",
    "Software Engineer",
    "Web Developer",
    "Network Engineer",
    "Data Analyst",
    "UI/UX Designer",
    "Project Manager"
  ];

  // Handle form submission
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Create job object with form data
    const newJob = {
      id: jobId,
      type: jobType,
      field: jobField,
      date: dueDate,
      position: jobPosition,
      contact: contactNumber,
      salary,
      background,
      location,
      email,
      workType,
      description,
      status: "Pending" // Default status
    };

    // Get existing jobs from localStorage or create empty array
    const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]");

    // Add new job and save back to localStorage
    existingJobs.push(newJob);
    localStorage.setItem("jobs", JSON.stringify(existingJobs));

    // Alert success and redirect to job modification page
    alert("Job created successfully!");
    router.push("/job-modification");
  };

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

      {/* Main content area with sidebar and page content */}
      <div className={styles.bg}>
        <aside className={styles.sidebar}>
          <div className={styles.menu}>
            <div className={styles.menuItemActive}>▶ Job Creation</div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/job-modification")}
              style={{ cursor: "pointer" }}
            >
              ▶ Job Modification
            </div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/received-cvs")}
              style={{ cursor: "pointer" }}
            >
              ▶ Received CVs
            </div>
            <div
              className={styles.menuItem}
              onClick={() => router.push("/accepted-cvs")}
              style={{ cursor: "pointer" }}
            >
              ▶ Accepted CVs
            </div>
          </div>
        </aside>
        <main className={styles.content}>
          <div className={styles.formCard}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.fieldWide}>
                  <label>Select Job Type:</label>
                  <select
                    className={styles.selectInput}
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    required
                  >
                    <option value="">-- Select job type --</option>
                    {jobTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Job ID:</label>
                  <input
                    type="text"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Job Position:</label>
                  <input
                    type="text"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Contact Number:</label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Job Field:</label>
                  <input
                    type="text"
                    value={jobField}
                    onChange={(e) => setJobField(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Salary:</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Due Date:</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Background :</label>
                  <input
                    type="text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Company Location :</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Company Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Work Type:</label>
                  <input
                    type="text"
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.fieldWide}>
                  <label>Job Description :</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
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