import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Signup.module.css';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Call the backend API for authentication
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Instead of throwing an error, set the error state directly
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return; // Stop execution here
      }
      
      // Use the context login function instead of manually setting items
      login(data.user, data.token);
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        // Show admin dashboard or special admin navigation
        router.replace('/job-creation');  // Or any admin page
      } else {
        router.replace('/');  // Regular user homepage
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Enhanced error handling with specific messages
      if (err instanceof Error) {
        // Check for specific error cases
        if (err.message.includes('Invalid credentials')) {
          setError('Incorrect email or password. Please try again.');
        } else if (err.message.includes('not found')) {
          setError('Account not found. Please sign up first.');
        } else {
          setError(err.message || 'Login failed. Please try again.');
        }
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        {/* Login Form */}
        <div className={styles.formSection}>
          <h1 className={styles.loginTitle}>Login</h1>
          
          {error && (
            <div style={{ 
              color: '#721c24', 
              backgroundColor: '#f8d7da',
              padding: '12px 15px',
              borderRadius: '4px',
              marginBottom: '20px',
              border: '1px solid #f5c6cb',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                style={{ marginRight: '10px' }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.loginLabel}>Email address :</label>
              <input
                className={styles.loginInput}
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.loginLabel} style={{ fontSize: 22, lineHeight: '26px' }}>Password :</label>
              <input
                className={styles.loginInput}
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button 
              className={styles.loginBtn} 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className={styles.loginBottomRow}>
            <span className={styles.loginSmallText}>Don't you have account ?</span>
            <a href="/signup" className={styles.loginSignUpLink}>SignUp</a>
          </div>
          <div className={styles.loginOrRow}>
            <div className={styles.loginLine}></div>
            <span className={styles.loginOr}>OR</span>
            <div className={styles.loginLine}></div>
          </div>
          <div className={styles.loginSocialRow}>
            <img src="/google.png" alt="Google" className={styles.loginSocialIcon} />
            <img src="/fb.png" alt="Facebook" className={styles.loginSocialIcon} />
          </div>
        </div>
        {/* Illustration */}
        <div className={styles.illustration}>
          <img src="/login.png" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
}