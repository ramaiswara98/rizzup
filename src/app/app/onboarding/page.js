// components/RizzUpOnboarding.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Onboarding.module.css';
import { translations } from '@/translation';

export default function RizzUpOnboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState('english');
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language].onboardingPage;
  const slides = t.slides;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    // Mark onboarding as completed
    localStorage.setItem('onboardingCompleted', 'true');
    router.push('/app/onboarding-rate-response');
  };

  const getSlideIcon = (index) => {
    switch (index) {
      case 0:
        return (
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="url(#gradient1)"/>
            <defs>
              <linearGradient id="gradient1" x1="3" y1="2" x2="13" y2="22">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
        );
      case 1:
        return (
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="#2196F3"/>
            <circle cx="8" cy="10" r="1.5" fill="#2196F3"/>
            <circle cx="12" cy="10" r="1.5" fill="#2196F3"/>
            <circle cx="16" cy="10" r="1.5" fill="#2196F3"/>
          </svg>
        );
      case 2:
        return (
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M13.5 2L10 8H4L8 12L6 18L13.5 22L21 18L19 12L23 8H17L13.5 2Z" fill="#FF9800"/>
          </svg>
        );
      case 3:
        return (
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#9C27B0"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Skip Button */}
        {currentSlide < slides.length - 1 && (
          <button className={styles.skipButton} onClick={handleSkip}>
            {t.skip}
          </button>
        )}

        {/* Slide Content */}
        <div className={styles.slideContainer}>
          <div className={styles.iconContainer}>
            <div className={styles.iconCircle}>
              {getSlideIcon(currentSlide)}
            </div>
          </div>

          <div className={styles.textContent}>
            <h1 className={styles.slideTitle}>{slides[currentSlide].title}</h1>
            <p className={styles.slideSubtitle}>{slides[currentSlide].subtitle}</p>
            <p className={styles.slideDescription}>{slides[currentSlide].description}</p>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className={styles.dotsContainer}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next/Get Started Button */}
        <button className={styles.nextButton} onClick={handleNext}>
          {currentSlide < slides.length - 1 ? t.next : t.getStarted}
        </button>

        {/* Swipe Gesture Support */}
        <div 
          className={styles.swipeArea}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const startX = touch.clientX;
            
            const handleTouchMove = (e) => {
              const touch = e.touches[0];
              const diffX = startX - touch.clientX;
              
              if (Math.abs(diffX) > 50) {
                if (diffX > 0 && currentSlide < slides.length - 1) {
                  setCurrentSlide(currentSlide + 1);
                } else if (diffX < 0 && currentSlide > 0) {
                  setCurrentSlide(currentSlide - 1);
                }
                document.removeEventListener('touchmove', handleTouchMove);
              }
            };
            
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', () => {
              document.removeEventListener('touchmove', handleTouchMove);
            }, { once: true });
          }}
        />
      </div>
    </div>
  );
}