import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Apply() {
  const router = useRouter();
  const { jobId, jobTitle: jobTitleParam } = router.query;
  const [jobTitle, setJobTitle] = useState("Loading job title...");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nameWithInitials: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    contactNumber: "",
    field: ""
  });

  // Get job details from localStorage when component mounts or query params change
  useEffect(() => {
    // If direct jobTitle is provided in URL, use it
    if (jobTitleParam) {
      setJobTitle(jobTitleParam as string);
    } 
    // Otherwise, try to look up by jobId
    else if (jobId) {
      const savedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const selectedJob = savedJobs.find((job: { id: string | string[]; }) => job.id === jobId);
      
      if (selectedJob) {
        // Use job type, position, or a fallback
        setJobTitle(selectedJob.type || selectedJob.position || "Job Position");
      } else {
        setJobTitle("Unknown Job");
      }
    }
  }, [jobId, jobTitleParam]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create application object
    const application = {
      jobTitle,
      ...formData,
      cvFileName: cvFile ? cvFile.name : null,
      submissionDate: new Date().toISOString(),
      status: "Pending"
    };
    
    // Save to localStorage
    const applications = JSON.parse(localStorage.getItem("applications") || "[]");
    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));
    
    // Show success message and redirect
    alert("Your application has been submitted successfully!");
    router.push("/job-status");
  };

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
           
            <a href="/jobs">Jobs</a>
            <span>|</span>
            <a href="/vacancies">jobs for you</a>
            <span>|</span>
            <a href="/">Home</a>
            <span>|</span>
            <a href="/login">Login</a>
          </nav>
        </header>

        <form className={styles.applyForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Job Title :</label>
            <span className={styles.formValue}>{jobTitle}</span>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Name with Initials:</label>
            <input 
              className={styles.formInput} 
              type="text" 
              name="nameWithInitials"
              value={formData.nameWithInitials}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Full Name :</label>
            <input 
              className={styles.formInput} 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Gender :</label>
            <select 
              className={styles.formInput}
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Date of Birth :</label>
            <input 
              className={styles.formInput} 
              type="date" 
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Email :</label>
            <input 
              className={styles.formInput} 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Contact Number :</label>
            <input 
              className={styles.formInput} 
              type="tel" 
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Field :</label>
            <select 
              className={styles.formInput}
              name="field"
              value={formData.field}
              onChange={handleInputChange}
              required
            >
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
                required
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