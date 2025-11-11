// components/RizzUpProfile.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Profile.module.css';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { translations } from '@/translation';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function RizzUpProfile() {
  const [language, setLanguage] = useState('english');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    rizzScore: 0,
    suggestionsUsed: 0,
    conversationsStarted: 0,
    conversationsRated: 0
  });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Get user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchUserStats(JSON.parse(savedUser).uid);
    } else {
      // Redirect to login if no user
      router.push('/login');
    }
  }, [router]);

  const fetchUserStats = async (uid) => {
    try {
      const response = await fetch(`/api/user/stats?uid=${uid}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      localStorage.removeItem('selectedLanguage');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const t = translations[language].profilePage;

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link className={styles.backButton} href="/app/home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
            </svg>
          </Link>
          <h1 className={styles.title}>{t.title}</h1>
          <div className={styles.placeholder}></div>
        </header>

        <div className={styles.content}>
          {/* Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.avatarContainer}>
              <img 
                src={user.photoURL || '/default-avatar.png'} 
                alt={user.displayName}
                className={styles.avatar}
              />
            </div>
            <h2 className={styles.userName}>{user.displayName}</h2>
            <p className={styles.userEmail}>{user.email}</p>
          </div>

          {/* Stats Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.myStats}</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#E3F2FD' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2196F3">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stats.rizzScore}</div>
                  <div className={styles.statLabel}>{t.rizzScore}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#FFF3E0' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF9800">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stats.suggestionsUsed}</div>
                  <div className={styles.statLabel}>{t.suggestionsUsed}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#E8F5E9' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#4CAF50">
                    <path d="M13.5 2L10 8H4L8 12L6 18L13.5 22L21 18L19 12L23 8H17L13.5 2Z"/>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stats.conversationsStarted}</div>
                  <div className={styles.statLabel}>{t.conversationsStarted}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#F3E5F5' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#9C27B0">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stats.conversationsRated}</div>
                  <div className={styles.statLabel}>{t.conversationsRated}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.settings}</h3>
            
            {/* Language Setting */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}>🌐</div>
                <div>
                  <div className={styles.settingTitle}>{t.language}</div>
                </div>
              </div>
              <div className={styles.languageToggle}>
                <button 
                  className={`${styles.langButton} ${language === 'english' ? styles.langActive : ''}`}
                  onClick={() => handleLanguageChange('english')}
                  title="English"
                >
                  🇬🇧
                </button>
                <button 
                  className={`${styles.langButton} ${language === 'indonesia' ? styles.langActive : ''}`}
                  onClick={() => handleLanguageChange('indonesia')}
                  title="Indonesia"
                >
                  🇮🇩
                </button>
              </div>
            </div>

            {/* Notifications Setting */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}>🔔</div>
                <div>
                  <div className={styles.settingTitle}>{t.notifications}</div>
                  <div className={styles.settingDesc}>{t.notificationsDesc}</div>
                </div>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            {/* Dark Mode Setting */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}>🌙</div>
                <div>
                  <div className={styles.settingTitle}>{t.darkMode}</div>
                  <div className={styles.settingDesc}>{t.darkModeDesc}</div>
                </div>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {/* Account Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t.account}</h3>
            
            <button className={styles.accountItem}>
              <span className={styles.accountIcon}>✏️</span>
              <span className={styles.accountText}>{t.editProfile}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" fill="#999"/>
              </svg>
            </button>

            <button className={styles.accountItem}>
              <span className={styles.accountIcon}>🔒</span>
              <span className={styles.accountText}>{t.privacyPolicy}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" fill="#999"/>
              </svg>
            </button>

            <button className={styles.accountItem}>
              <span className={styles.accountIcon}>📄</span>
              <span className={styles.accountText}>{t.termsOfService}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" fill="#999"/>
              </svg>
            </button>
          </div>

          {/* Logout Button */}
          <button 
            className={styles.logoutButton}
            onClick={() => setShowLogoutModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
            </svg>
            {t.logout}
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>{t.logout}</h3>
              <p className={styles.modalText}>{t.logoutConfirm}</p>
              <div className={styles.modalButtons}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowLogoutModal(false)}
                >
                  {t.cancel}
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={handleLogout}
                >
                  {t.confirmLogout}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        {/* <nav className={styles.bottomNav}>
          <Link href="/app/home" className={styles.navItem}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
            </svg>
            <span>{translations[language].nav.home}</span>
          </Link>
          <button className={styles.navItem}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" fill="currentColor"/>
            </svg>
            <span>{translations[language].nav.history}</span>
          </button>
          <button className={`${styles.navItem} ${styles.active}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
            <span>{translations[language].nav.profile}</span>
          </button>
        </nav> */}
      </div>
    </div>
  );
}