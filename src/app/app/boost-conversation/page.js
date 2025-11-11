// components/BoostConversation.jsx
'use client';

import Link from 'next/link';
import styles from './BoostConversation.module.css';

export default function BoostConversation() {
  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link 
            className={styles.backButton}
            href={'/app/home'}
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
            </svg>
          </Link>
          <h1 className={styles.title}>Boost Conversation</h1>
          <div></div>
        </header>

        <div className={styles.content}>
          {/* Start Conversation Card */}
          <Link 
            className={styles.primaryCard}
            href={'/app/boost-conversation/start-conversation'}
            >
            <div className={styles.cardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white"/>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Start Conversation</h2>
              <p className={styles.cardDescription}>Create a first message with AI help</p>
            </div>
          </Link>

          {/* Improve Conversation Card */}
          <Link 
            className={styles.primaryCard}
            href={'/app/boost-conversation/improve-conversation'}
            >
            <div className={styles.cardIconSecondary}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="currentColor"/>
              </svg>
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Improve Conversation</h2>
              <p className={styles.cardDescription}>Upload chat to get AI response suggestions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}