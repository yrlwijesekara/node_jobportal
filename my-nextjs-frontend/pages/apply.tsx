import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Apply() {
  const router = useRouter();
  const { jobId } = router.query;
  const [jobTitle, setJobTitle] = useState("Loading job title...");
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{email: string, id: string} | null>(null);
  
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

  // Check if user is logged in and get job details
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to apply for jobs");
        router.push("/login?redirect=/apply?jobId=" + jobId);
        return;
      }

      try {
        // Get user info from API
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error("Failed to get user info");
        }

        const userData = await userResponse.json();
        setUser(userData.user);
        
        // Pre-fill email from user data
        setFormData(prev => ({
          ...prev,
          email: userData.user.email
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
        alert("Please log in again to apply for jobs");
        router.push("/login");
      }
    };

    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        
        if (!response.ok) {
          console.error(`Failed to fetch job details: ${response.status}`);
          setJobTitle("Job Not Found");
          setError(`Could not load job details. The job might have been removed or doesn't exist.`);
          return;
        }
        
        const data = await response.json();
        
        // Set job details
        setJobDetails(data.job);
        
        // Set job title matching how it's displayed in job cards
        // This prioritizes type first, then position, and uses a consistent format
        if (data.job.type) {
          setJobTitle(data.job.type);
        } else if (data.job.position) {
          setJobTitle(data.job.position);
        } else if (data.job.jobId) {
          setJobTitle(`Job #${data.job.jobId}`);
        } else {
          setJobTitle("Job Position");
        }
        
        // Save additional job details to pre-fill the form if needed
        if (data.job.field) {
          setFormData(prev => ({
            ...prev,
            field: data.job.field.toLowerCase()
          }));
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setJobTitle("Unknown Job");
        setError("Failed to load job details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please log in to submit your application");
      router.push("/login");
      return;
    }

    if (!jobId) {
      setError("Missing job ID. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Create form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("jobId", jobId as string);
      formDataToSend.append("nameWithInitials", formData.nameWithInitials);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("contactNumber", formData.contactNumber);
      formDataToSend.append("field", formData.field);
      
      // Add CV file if available
      if (cvFile) {
        formDataToSend.append("cv", cvFile);
      }

      // Get token
      const token = localStorage.getItem("token");
      
      // Send application to backend
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      // Handle non-OK responses without throwing errors
      if (!response.ok) {
        let errorMessage = "Failed to submit application";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use the default error message
        }
        
        console.error(`API Error (${response.status}): ${errorMessage}`);
        setError(errorMessage);
        return; // Exit early instead of throwing
      }

      // Only show success and redirect on successful submission
      alert("Your application has been submitted successfully!");
      router.push("/job-status");
    } catch (err: any) {
      // This will now only catch network errors or other unexpected exceptions
      console.error("Error submitting application:", err);
      setError("Network error while submitting your application. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // File upload handlers
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

        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}

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
              readOnly={!!user} // Make email readonly if user is logged in
            />
            {user && <small className={styles.helperText}>Email from your account</small>}
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
            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}