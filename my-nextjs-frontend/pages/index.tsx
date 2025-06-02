import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import LatestJobs from '../components/latestjobs';

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* Blue Top Section */}
      <div className={styles.topSection}>
        {/* Top Navigation Bar */}
        <header className={styles.topBar}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <span className={styles.title}>Training Program</span>
          {/* Hamburger icon for mobile */}
          <div
            className={styles.hamburger}
            onClick={() => setNavOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </div>
          <nav className={`${styles.nav} ${navOpen ? styles.open : ''}`}>
            <a href="/">Home</a>
            <span>|</span>
            <a href="/about">About Us</a>
            <span>|</span>
            <a href="/vacancies">Vacancies</a>
            <span>|</span>
            <a href="/login">Login</a>
          </nav>
        </header>
        {/* Main Banner */}
        <section className={styles.banner}>
          <img src="/mobitel.png" alt="Banner" className={styles.bannerImg} />
        </section>
      </div>

      {/* Latest Jobs Section */}
      <LatestJobs />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerColumns}>
          {/* About Us */}
          <div>
            <div className={styles.footerTitle}>ABOUT US</div>
            <a className={styles.footerLink} href="https://slt.lk/en/about-us/corporate-responsibility">Cooperate Responsibility</a>
            <a className={styles.footerLink} href="https://slt.lk/en/about-us/investors/financial-reports/annual">Investors</a>
            <a className={styles.footerLink} href="https://slt.lk/en/about-us/news">Media Center</a>
            <a className={styles.footerLink} href="https://slt.lk/en/careers">Careers</a>
          </div>
          {/* Business */}
          <div>
            <div className={styles.footerTitle}>BUSINESS</div>
            <a className={styles.footerLink} href="https://slt.lk/index.php/en/business">Enterprises</a>
            <a className={styles.footerLink} href="https://slt.lk/index.php/en/sme-micro-business">SME</a>
            <a className={styles.footerLink} href="https://slt.lk/index.php/en/wholesale">Wholesale</a>
            <a className={styles.footerLink} href="https://www.xyntac.com/">International</a>
          </div>
          {/* Contact Us */}
          <div>
            <div className={styles.footerTitle}>CONTACT US</div>
            <div className={styles.footerText}>
              Sri Lanka Telecom PLC<br />
              Lotus Road, P.O.Box 503,<br />
              Colombo 01, Sri Lanka.<br />
              Telephone: +94 112 021 000<br />
              Email: pr@slt.lk<br />
              (Monday to Friday - 9am to 5pm)
            </div>
          </div>
          {/* Customer Support */}
          <div>
            <div className={styles.footerTitle}>CUSTOMER SUPPORT</div>
            <div className={styles.footerText}>
              Telephone : 1212<br />
              Email : 1212@slt.com.lk<br />
              Self Service : +94 112 12 12 12
            </div>
          </div>
          {/* Social Icons */}
          <div className={styles.socialBox}>
            <div className={styles.socialIcons}>
              <a href="#"><img src="img_facebook_1.png" alt="Facebook" /></a>
              <a href="#"><img src="img_twittersign_1.png" alt="Twitter" /></a>
              <a href="#"><img src="img_instagram_1.png" alt="Instagram" /></a>
              <a href="#"><img src="img_youtube_1.png" alt="YouTube" /></a>
              <a href="#"><img src="img_linkedin_1.png" alt="LinkedIn" /></a>
              <a href="#"><img src="img_tiktok_1.png" alt="TikTok" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}