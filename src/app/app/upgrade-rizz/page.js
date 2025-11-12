// app/upgrade-rizz/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UpgradeRizz.module.css';
import { translations } from '@/translation';

export default function UpgradeRizzPage() {
  const [language, setLanguage] = useState('english');
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language].upgradeRizzPage;

  const handleUpgrade = () => {
    // Navigate to home or subscription page
    router.push('/app/home');
  };

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Success Icon with decorations */}
        <div className={styles.iconSection}>
          <div className={styles.backgroundCircle}>
            <div className={styles.innerCircle}>
              {/* Robot/Bot Icon */}
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="8" width="12" height="12" rx="2" fill="white"/>
                <rect x="9" y="11" width="2" height="2" rx="1" fill="#7C3AED"/>
                <rect x="13" y="11" width="2" height="2" rx="1" fill="#7C3AED"/>
                <rect x="9" y="15" width="6" height="1.5" rx="0.75" fill="#7C3AED"/>
                <circle cx="12" cy="6" r="1" fill="white"/>
                <line x1="12" y1="6" x2="12" y2="8" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          
          {/* Chat bubble decoration - top left */}
          <div className={styles.chatBubble1}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
          
          {/* Lightning decoration - top right */}
          <div className={styles.lightning}>⚡</div>
          
          {/* Heart decoration - bottom right */}
          <div className={styles.heart}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className={styles.textContent}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>
            {t.subtitle} <span className={styles.appName}>{t.appName}</span>
          </p>
        </div>

        {/* Feature Icons */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#EEF2FF' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#6366F1">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <p className={styles.featureLabel}>{t.suggestedReply}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#F3E8FF' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#A855F7">
                <path d="M13.5 2L10 8H4L8 12L6 18L13.5 22L21 18L19 12L23 8H17L13.5 2Z"/>
              </svg>
            </div>
            <p className={styles.featureLabel}>{t.boostConversation}</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: '#EEF2FF' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#6366F1">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
            <p className={styles.featureLabel}>{t.rateMyConvo}</p>
          </div>
        </div>

        {/* Upgrade Button */}
        <button className={styles.upgradeButton} onClick={handleUpgrade}>
          {t.upgradeButton} →
        </button>

        {/* Terms & Privacy */}
        <p className={styles.termsText}>
          {t.termsText}{' '}
          <a href="/terms" className={styles.link}>{t.termsOfService}</a>{' '}
          {t.and}{' '}
          <a href="/privacy" className={styles.link}>{t.privacyPolicy}</a>
        </p>
      </div>
    </div>
  );
}