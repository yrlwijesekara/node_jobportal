import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Signup.module.css';

export default function Signup() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords didn\'t match');
      return;
    }
    setError('');
    // You can add validation or API call here if needed
    router.push('/');
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
              <label className={styles.registerLabel}>User ID</label>
              <input className={styles.registerInput} type="text" />
            </div>
            <div className={styles.registerInputGroup}>
              <label className={styles.registerLabel}>Name</label>
              <input className={styles.registerInput} type="text" />
            </div>
            <div className={styles.registerInputGroup}>
              <label className={styles.registerLabel}>Password</label>
              <input
                className={styles.registerInput}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.registerInputGroup}>
              <label className={styles.registerLabel}>Confirm Password</label>
              <input
                className={styles.registerInput}
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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