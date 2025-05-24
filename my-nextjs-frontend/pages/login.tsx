import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Signup.module.css';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple admin check
    const isAdmin = email === "admin@example.com" && password === "admin123";
    login(isAdmin ? "admin" : "user");
    if (isAdmin) {
      router.replace('/job-creation');
    } else {
      const redirect = router.query.redirect as string;
      router.replace(redirect || '/');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        {/* Login Form */}
        <div className={styles.formSection}>
          <h1 className={styles.loginTitle}>Login</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.loginLabel}>Email address :</label>
              <input
                className={styles.loginInput}
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
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
              />
            </div>
            <button className={styles.loginBtn} type="submit">Sign In</button>
          </form>
          <div className={styles.loginBottomRow}>
            <span className={styles.loginSmallText}>Don’t you have account ?</span>
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