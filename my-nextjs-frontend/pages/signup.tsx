import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Signup.module.css';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');  // Add state for email
  const [name, setName] = useState('');    // Add state for name
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Add password length validation
    if (password.length < 6) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords didn\'t match');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError('Server error during registration');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <div className={styles.illustration}>
          <img src="/register.png" alt="Register Illustration" />
        </div>
        <div className={styles.formSection}>
          <div className={styles.registerTitleBox}>
            <span className={styles.registerTitle}>Register</span>
          </div>
          <form className={styles.registerFormVertical} onSubmit={handleSubmit}>
            <div className={styles.registerInputGroup}>
              <label className={styles.registerLabel}>Email</label>
              <input 
                className={styles.registerInput} 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className={styles.registerInputGroup}>
              <label className={styles.registerLabel}>Name</label>
              <input 
                className={styles.registerInput} 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className={styles.registerInputGroup}>
              <label className={styles.registerLabel}>Password</label>
              <input
                className={styles.registerInput}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
              <span className={styles.passwordHelper}>
                Password must be at least 8 characters long
              </span>
            </div>
            <div className={styles.registerInputGroup}>
              <label className={styles.registerLabel}>Confirm Password</label>
              <input
                className={styles.registerInput}
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            {error && (
              <div style={{ color: 'red', marginBottom: 8, marginLeft: 4 }}>
                {error}
              </div>
            )}
            <div className={styles.registerBtnRow}>
              <button className={styles.registerBtn} type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}