// components/RizzUpLogin.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { translations } from '@/translation';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function RizzUpLogin() {
  const [language, setLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language].loginPage;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Sign in with Firebase Google Auth
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('User signed in:', user);
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Check if user is new or existing
      const checkUserResponse = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email
        })
      });

      const checkUserData = await checkUserResponse.json();
      
      if (!checkUserData.success) {
        throw new Error('Failed to check user status');
      }

      console.log('User check result:', checkUserData);

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));

      // If new user, save to database
      if (checkUserData.isNewUser) {
        console.log('New user detected - saving to database');
        
        const saveUserResponse = await fetch('/api/auth/save-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            language: language
          })
        });

        const saveUserData = await saveUserResponse.json();
        
        if (!saveUserData.success) {
          throw new Error('Failed to save user to database');
        }
        
        console.log('New user saved to MongoDB:', saveUserData);
        
        // Route new users to welcome/onboarding or paywall
        router.push('/app/onboarding'); // or '/app/paywall' for immediate subscription
        
      } else {
        console.log('Existing user detected');
        
        // Check if existing user has active subscription
        if (checkUserData.hasSubscription) {
          console.log('User has active subscription');
          // Route to main app
          router.push('/app/home');
        } else {
          console.log('User has no active subscription');
          // Route to paywall to subscribe
          router.push('/app/paywall');
        }
      }
      
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert(`${t.errorTitle}\n${t.errorMessage}`);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* App Icon */}
          <div className={styles.iconContainer}>
            <div className={styles.iconCircle}>
              <div className={styles.appIcon}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" 
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeTitle}>
              {t.welcomeTo} <span className={styles.brandName}>{t.appName}</span>
            </h1>
            <p className={styles.welcomeSubtitle}>
              {t.subtitle}
            </p>
          </div>

          {/* Google Sign In Button */}
          <button 
            className={styles.googleButton}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg 
              className={styles.googleIcon} 
              width="18" 
              height="18" 
              viewBox="0 0 18 18"
            >
              <path 
                fill="#4285F4" 
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              />
              <path 
                fill="#34A853" 
                d="M9.003 18c2.43 0 4.467-.806 5.956-2.183l-2.909-2.259c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"
              />
              <path 
                fill="#FBBC05" 
                d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              />
              <path 
                fill="#EA4335" 
                d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
              />
            </svg>
            <span className={styles.googleButtonText}>
              {isLoading ? t.signingIn : t.continueWithGoogle}
            </span>
          </button>

          {/* Loading Indicator */}
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Signing you in...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}