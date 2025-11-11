// components/RizzUpWelcome.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './WelcomePage.module.css';

export default function RizzUpWelcome() {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const router = useRouter();

  const handleNext = () => {
    // Save selected language to localStorage
    localStorage.setItem('selectedLanguage', selectedLanguage);
    
    console.log('Selected language:', selectedLanguage);
    
    // Navigate to /app/home
    router.push('/app/login');
  };

  return (
    <div className={styles.phoneFrame}>
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Floating Chat Illustration */}
        <div className={styles.illustration}>
          {/* Large purple circle background */}
          <div className={styles.backgroundCircle} />
          
          {/* Center chat icon */}
          <div className={styles.centerIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" fill="white"/>
            </svg>
          </div>

          {/* "Hey!" bubble - top left */}
          <div className={`${styles.bubble} ${styles.bubbleHey}`}>
            <p className={styles.bubbleText}>Hey!</p>
            <div className={styles.onlineIndicator} />
          </div>

          {/* Star bubble - top right */}
          <div className={`${styles.bubble} ${styles.bubbleStar}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>

          {/* "Nice!" bubble - right middle */}
          <div className={`${styles.bubble} ${styles.bubbleNice}`}>
            <p className={styles.bubbleTextWhite}>Nice!</p>
          </div>

          {/* Heart bubble - bottom right */}
          <div className={`${styles.bubble} ${styles.bubbleHeart}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          {/* Chat bubble - bottom left */}
          <div className={`${styles.bubble} ${styles.bubbleChat}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>

          {/* Small decorative circles */}
          <div className={`${styles.decorCircle} ${styles.decorCircle1}`} />
          <div className={`${styles.decorCircle} ${styles.decorCircle2}`} />
          <div className={`${styles.decorCircle} ${styles.decorCircle3}`} />
          <div className={`${styles.decorCircle} ${styles.decorCircle4}`} />
        </div>

        {/* Welcome Text */}
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>
            Welcome to <span className={styles.brandName}>RizzUp</span>
          </h1>
          <p className={styles.welcomeSubtitle}>
            Boost your conversations and<br />improve your rizz with AI
          </p>
        </div>

        {/* Language Selector */}
        <div className={styles.languageSection}>
          <p className={styles.languageLabel}>Choose your language</p>
          <div className={styles.languageButtons}>
            <button
              onClick={() => setSelectedLanguage('english')}
              className={`${styles.languageButton} ${
                selectedLanguage === 'english' ? styles.languageButtonActive : ''
              }`}
            >
              <div className={styles.languageContent}>
                <span className={styles.languageFlag}>🇬🇧</span>
                <span className={styles.languageName}>English</span>
              </div>
              {selectedLanguage === 'english' && (
                <div className={styles.languageGlow} />
              )}
            </button>

            <button
              onClick={() => setSelectedLanguage('indonesia')}
              className={`${styles.languageButton} ${styles.languageButtonIndonesia} ${
                selectedLanguage === 'indonesia' ? styles.languageButtonActiveIndonesia : ''
              }`}
            >
              <div className={styles.languageContent}>
                <span className={styles.languageFlag}>🇮🇩</span>
                <span className={styles.languageName}>Indonesia</span>
              </div>
              {selectedLanguage === 'indonesia' && (
                <div className={styles.languageGlowRed} />
              )}
            </button>
          </div>
        </div>

        {/* Next Button */}
        <button onClick={handleNext} className={styles.nextButton}>
          Next
        </button>
      </div>
    </div>
    </div>
  );
}