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

  // Add this state for handling submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  // Replace your existing handleSubmit function with this one:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Create job object with form data
    const newJob = {
      jobId,
      type: jobType,
      field: jobField,
      dueDate,
      position: jobPosition,
      contactNumber,
      salary,
      background,
      location,
      email,
      workType,
      description,
      status: "Pending" // Default status
    };

    // Updated error handling for your job creation function
    try {
      const token = localStorage.getItem("token");
      console.log("Raw token from localStorage:", token);
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      // Send job data to backend API
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newJob)
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        // Handle non-JSON error responses
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Server returned non-JSON response:', text);
          setError('Server error: Invalid response format');
          return;
        }
        
        // Parse JSON error
        const data = await response.json();
        setError(data.error || 'Failed to create job');
        return;
      }

      // Success case
      const data = await response.json();
      
      // Alert success and redirect to job modification page
      alert("Job created successfully!");
      localStorage.setItem("jobsUpdated", "true");
      router.push("/job-modification");
    } catch (err) {
      console.error('Job creation error:', err);
      setError('Network error: Could not connect to server');
    } finally {
      setIsSubmitting(false);
    }
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
              {/* Add this right before your form or at the top of your form */}
              {error && (
                <div className={styles.errorMessage}>
                  <p>{error}</p>
                </div>
              )}

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
                {/* Modify your submit button to show loading state */}
                <button 
                  type="submit" 
                  className={styles.createBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}