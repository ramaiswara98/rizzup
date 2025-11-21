// src/app/home/page.js
'use client';

import { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={styles.container}>
      {/* Background gradient */}
      <div className={styles.backgroundGradient} />

      {/* Main content wrapper */}
      <main className={styles.mainContent}>
        {/* Two-column layout: Text & CTA (left) + Visual (right) */}
        <div className={styles.heroGrid}>
          {/* LEFT COLUMN: Text & CTA */}
          <section className={`${styles.textSection} ${isLoaded ? styles.slideInLeft : ''}`}>
            {/* Decorative badge */}
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Digunakan oleh 10.000+ pengguna setiap hari
            </div>

            {/* Main headline */}
            <h1 className={styles.headline}>
              Tingkatkan <span className={styles.highlight}>Rizz</span>-mu dengan RizzUp
            </h1>

            {/* Subheadline */}
            <p className={styles.subheadline}>
              Aplikasi revolusioner yang meningkatkan kepercayaan diri dan charisma Anda. 
              Dapatkan tips, analisis, dan latihan personalized untuk menjadi versi terbaik diri Anda.
            </p>

            {/* Features list */}
            <ul className={styles.featuresList}>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span>Analisis kepribadian mendalam dan real-time</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span>Program latihan interaktif & engaging</span>
              </li>
              <li className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span>Komunitas supportif dengan 10.000+ members</span>
              </li>
            </ul>

            {/* CTA Button */}
            <button className={styles.ctaButton} onClick={() => {
              // Handle CTA action - can be updated to navigate or show modal
              window.location.href = '/app';
            }}>
              <span className={styles.buttonText}>Coba Sekarang</span>
              <span className={styles.buttonArrow}>→</span>
            </button>

            {/* Trust text */}
            <p className={styles.trustText}>
              Gratis selama 14 hari. Tidak perlu kartu kredit.
            </p>
          </section>

          {/* RIGHT COLUMN: Visual/Illustration */}
          <section className={`${styles.visualSection} ${isLoaded ? styles.slideInRight : ''}`}>
            {/* Animated illustration wrapper */}
            <div className={styles.illustrationContainer}>
              {/* Decorative floating elements */}
              <div className={styles.floatingElement1} />
              <div className={styles.floatingElement2} />
              <div className={styles.floatingElement3} />

              {/* Main illustration card */}
              <div className={styles.illustrationCard}>
                {/* Simulated app screenshot placeholder with playful design */}
                <div className={styles.appPreview}>
                  <div className={styles.appHeader}>
                    <div className={styles.appTitle}>RizzUp Dashboard</div>
                    <div className={styles.appSubtitle}>Your Charisma Score</div>
                  </div>

                  {/* Charisma score visualization */}
                  <div className={styles.scoreContainer}>
                    <div className={styles.scoreCircle}>
                      <span className={styles.scoreValue}>87</span>
                      <span className={styles.scoreLabel}>/ 100</span>
                    </div>
                    <div className={styles.scoreDescription}>
                      <p>Kamu meningkat <strong>+12%</strong> minggu ini! 🚀</p>
                      <p className={styles.scoreHint}>Terus konsisten untuk hasil maksimal</p>
                    </div>
                  </div>

                  {/* Achievement badges */}
                  <div className={styles.achievements}>
                    <div className={styles.badge2}>💬 Communicator</div>
                    <div className={styles.badge2}>🎯 Confident</div>
                    <div className={styles.badge2}>⭐ Rising Star</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}