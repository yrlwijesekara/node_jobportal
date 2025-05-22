import React from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Blue Top Section */}
      <div className={styles.topSection}>
        {/* Top Navigation Bar */}
        <header className={styles.topBar}>
          <img src="/logo.png" alt="Logo" className={styles.logo} />
          <span className={styles.title}>Training Program</span>
          <nav className={styles.nav}>
            <a href="/home">Home</a>
            <span>|</span>
            <a href="/about">About Us</a>
            <span>|</span>
            <a href="#">Vacancies</a>
            <span>|</span>
            <a href="/login">Login</a>
          </nav>
        </header>
        {/* Main Banner */}
        <section className={styles.banner}>
          <img src="/mobitel.png" alt="Banner" className={styles.bannerImg} />
        </section>
      </div>

      {/* Cards Section */}
      <section className={styles.cards}>
        {/* Card 1 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>Trainee Network Engineers</div>
          <div className={styles.cardBody}>
            <p>
              We are hiring new training network engineers for SLTMobitel, Only an associate degree, a bachelor’s degree in computer science, information technology, computer engineering, or a related field undergraduates (3rd year, 4th year), and fresh graduates are proffered.
            </p>
            <ul>
              <li>No job experiences are needed.</li>
              <li>Networking knowledge.</li>
              <li>Operating systems knowledge.</li>
              <li>Network devices and security knowledge.</li>
              <li>Networking device configuration knowledge.</li>
            </ul>
          </div>
          <button className={styles.applyBtn}>Apply Now</button>
        </div>
        {/* Card 2 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>ACCOUNTANT-FINANCIAL ACCOUNTING</div>
          <div className={styles.cardBody}>
            <p>
              Sri Lanka Telecom is in search of high caliber, result-oriented and qualified individuals capable of playing a key role in the finance team...
            </p>
            <ul>
              <li>Associate Membership of ICA/CIMA/ACCA</li>
              <li>Preference will be given to the candidates who are prize winners.</li>
              <li>Be a resilient leader with excellent interpersonal and communication skills.</li>
            </ul>
          </div>
          <button className={styles.applyBtn}>Apply Now</button>
        </div>
        {/* Card 3 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>ENGINEERS</div>
          <div className={styles.cardBody}>
            <p>
              As an Engineer of the pioneering ICT solutions provider, you will be a distinguished member of our team...
            </p>
            <ul>
              <li>Four-year Degree in BSc Engineering/ Bachelor of Technology...</li>
              <li>Thorough knowledge and experience in the field of Data Centre Network Security...</li>
            </ul>
          </div>
          <button className={styles.applyBtn}>Apply Now</button>
        </div>
        {/* Card 4 */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>TECHNICIANS</div>
          <div className={styles.cardBody}>
            <p>
              Technicians are mainly responsible in install, maintain and repair electronic communications equipment...
            </p>
            <ul>
              <li>06 passes at the G.C.E. (O/L) exam including Sinhala Tamil and English Language and Mathematics and 03 credit passes in one sitting AND
</li>
              <li>Should have obtained Skilled Competence Certificate -NAITA in the relevant field equivalent to NVQ Level 4 (Telecommunication / Electrical/Electronic/ ICT/Power / Air Conditioning etc). </li>
            </ul>
          </div>
          <button className={styles.applyBtn}>Apply Now</button>
        </div>
      </section>

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