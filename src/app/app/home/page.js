// components/RizzUpHome.jsx
'use client';

import { useState, useEffect } from 'react';
import styles from './home.module.css';
import Link from 'next/link';
import { translations } from '@/translation';
import Image from 'next/image';

export default function RizzUpHome() {
  const [rizzScore, setRizzScore] = useState(0);
  const [suggestionsUsed, setSuggestionsUsed] = useState(0);
  const [conversationsBoosted, setConversationsBoosted] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const initHome = async () => {
      // Get language from localStorage
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }

      // Get user from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        await fetchHomeData(userData.uid);
      } else {
        setLoading(false);
      }
    };

    initHome();
  }, []);

  const fetchHomeData = async (uid) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/home?uid=${uid}`);
      const result = await response.json();
      
      if (result.success) {
        const data = result.data;
        setRizzScore(data.rizzScore || 0);
        setSuggestionsUsed(data.suggestionsUsed || 0);
        setConversationsBoosted(data.conversationsStarted || 0);
        setTokens(data.tokens || 0);
        setIsPremium(data.isPremium || false);
      } else {
        console.error('Failed to fetch home data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className={styles.phoneFrame}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <Image 
            src="/svg/loading.svg" 
            alt="Loading" 
            width={100} 
            height={100} 
          />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.logo}>{t.logo}</h1>
          {/* Tokens Display */}
          <div className={styles.tokensDisplay}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#FFA500" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="3" fill="#FFA500"/>
            </svg>
            <span className={styles.tokensNumber}>{tokens}</span>
          </div>
        </header>

        {/* Welcome Section */}
        <section className={styles.welcome}>
          <h2 className={styles.welcomeTitle}>{t.welcomeTitle}</h2>
          <p className={styles.welcomeSubtitle}>{t.welcomeSubtitle}</p>
        </section>

        {/* Feature Cards */}
        <div className={styles.features}>
           <Link
            className={styles.featureCard}
            href={'/app/suggested-reply'}
            >
            <div className={`${styles.iconContainer} ${styles.blue}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="currentColor"/>
              </svg>
            </div>
            <div 
                className={styles.featureContent}
            >
              <h3 className={styles.featureTitle}>{t.suggestedReply.title}</h3>
              <p className={styles.featureDescription}>{t.suggestedReply.description}</p>
            </div>
            <div className={styles.arrow}>›</div>
          </Link>

           <Link
            className={styles.featureCard}
            href={'/app/start-conversation'}
            >
            <div className={`${styles.iconContainer} ${styles.orange}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13.5 2L10 8H4L8 12L6 18L13.5 22L21 18L19 12L23 8H17L13.5 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{t.startConversation.title}</h3>
              <p className={styles.featureDescription}>{t.startConversation.description}</p>
            </div>
            <div className={styles.arrow}>›</div>
          </Link>

          <Link
            className={styles.featureCard}
            href={'/app/rate-rizz'}
            >
            <div className={`${styles.iconContainer} ${styles.purple}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
              </svg>
            </div>
            <div 
              
              className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{t.rateRizz.title}</h3>
              <p className={styles.featureDescription}>{t.rateRizz.description}</p>
            </div>
            <div className={styles.arrow}>›</div>
          </Link>
        </div>

        {/* Progress Section */}
        <section className={styles.progress}>
          <h3 className={styles.progressTitle}>{t.progressTitle}</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={`${styles.statNumber} ${styles.blueText}`}>{suggestionsUsed}</div>
              <div className={styles.statLabel}>{t.suggestionsUsed}</div>
            </div>
            <div className={styles.stat}>
              <div className={`${styles.statNumber} ${styles.orangeText}`}>{conversationsBoosted}</div>
              <div className={styles.statLabel}>{t.conversationsStarted}</div>
            </div>
            <div className={styles.stat}>
              <div className={`${styles.statNumber} ${styles.purpleText}`}>{rizzScore}</div>
              <div className={styles.statLabel}>{t.rizzScore}</div>
            </div>
          </div>
        </section>

        {/* Bottom Navigation */}
        <nav className={styles.bottomNav}>
          <button className={`${styles.navItem} ${styles.active}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
            </svg>
            <span>{t.nav.home}</span>
          </button>
          <Link href={'/app/history'} className={styles.navItem}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" fill="currentColor"/>
            </svg>
            <span>{t.nav.history}</span>
          </Link>
          <Link href={'/app/profile'} className={styles.navItem}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
            <span>{t.nav.profile}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}