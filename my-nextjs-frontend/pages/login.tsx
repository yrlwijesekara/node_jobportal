import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Signup.module.css'; // Or Login.module.css if you separate

export default function Login() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add validation/auth logic here if needed
    router.push('/');
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
              <input className={styles.loginInput} type="email" required />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.loginLabel} style={{ fontSize: 22, lineHeight: '26px' }}>Password :</label>
              <input className={styles.loginInput} type="password" required />
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