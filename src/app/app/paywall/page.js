// app/paywall/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Paywall.module.css';
import { translations } from '@/translation';

export default function PaywallPage() {
  const [language, setLanguage] = useState('english');
  const [selectedPlan, setSelectedPlan] = useState('aura');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = translations[language].paywallPage;

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
    setLoading(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login first');
        router.push('/login');
        return;
      }

      // Determine price based on plan (in IDR)
      const amount = plan === 'charm' ? 99000 : 299000; // Rp 99,000 or Rp 299,000

      // Create Xendit invoice
      const response = await fetch('/api/payment/xendit/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          plan: plan,
          amount: amount,
          customerName: user.displayName || user.email?.split('@')[0],
        })
      });

      const data = await response.json();
      
      if (data.success && data.invoiceUrl) {
        // Redirect to Xendit payment page
        window.location.href = data.invoiceUrl;
      } else {
        alert('Failed to create payment: ' + (data.error || 'Unknown error'));
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login first');
        router.push('/login');
        return;
      }

      // Check if user has existing subscription
      const response = await fetch(`/api/subscription/check?uid=${user.uid}`);
      const data = await response.json();

      if (data.hasSubscription) {
        alert('Subscription restored successfully!');
        router.push('/app/home');
      } else {
        alert('No active subscription found');
      }
    } catch (error) {
      console.error('Error restoring subscription:', error);
      alert('Failed to restore subscription');
    }
  };

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Title Section */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <p>Creating payment...</p>
          </div>
        )}

        {/* Plans Container */}
        <div className={styles.plansContainer}>
          {/* Charm Plan */}
          <div 
            className={`${styles.planCard} ${selectedPlan === 'charm' ? styles.planCardSelected : ''}`}
            onClick={() => setSelectedPlan('charm')}
          >
            <div className={styles.planIconWrapper}>
              <div className={styles.planIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                ✨
              </div>
            </div>

            <div className={styles.planInfo}>
              <h3 className={styles.planTitle}>{t.charmTitle}</h3>
              <p className={styles.planSubtitle}>{t.charmSubtitle}</p>
            </div>

            <div className={styles.planPrice}>
              <div className={styles.priceRow}>
                <span className={styles.priceCurrency}>Rp</span>
                <span className={styles.priceAmount}>99,000</span>
              </div>
              <span className={styles.pricePeriod}>{t.perMonth}</span>
              <span className={styles.tokensInfo}>1,500 {t.tokens}</span>
            </div>

            <div className={styles.featuresWrapper}>
              <ul className={styles.featuresList}>
                {t.features.charm.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <div className={styles.checkIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              className={`${styles.selectButton} ${selectedPlan === 'charm' ? styles.selectButtonActive : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectPlan('charm');
              }}
              disabled={loading}
            >
              {selectedPlan === 'charm' ? '✓ ' : ''}{t.selectPlan}
            </button>
          </div>

          {/* Aura Plan */}
          <div 
            className={`${styles.planCard} ${styles.planCardPopular} ${selectedPlan === 'aura' ? styles.planCardSelected : ''}`}
            onClick={() => setSelectedPlan('aura')}
          >
            <div className={styles.popularBadge}>
              <span>⭐</span> {t.popularBadge}
            </div>
            
            <div className={styles.planIconWrapper}>
              <div className={styles.planIcon} style={{ background: 'white' }}>
                🔥
              </div>
            </div>

            <div className={styles.planInfo}>
              <h3 className={styles.planTitle}>{t.auraTitle}</h3>
              <p className={styles.planSubtitle}>{t.auraSubtitle}</p>
            </div>

            <div className={styles.planPrice}>
              <div className={styles.priceRow}>
                <span className={styles.priceCurrency}>Rp</span>
                <span className={styles.priceAmount}>299,000</span>
              </div>
              <span className={styles.pricePeriod}>{t.perMonth}</span>
              <span className={styles.tokensInfo}>5,000 {t.tokens}</span>
            </div>

            <div className={styles.featuresWrapper}>
              <ul className={styles.featuresList}>
                {t.features.aura.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <div className={styles.checkIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              className={`${styles.selectButton} ${styles.selectButtonPopular} ${selectedPlan === 'aura' ? styles.selectButtonActive : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectPlan('aura');
              }}
              disabled={loading}
            >
              {selectedPlan === 'aura' ? '✓ ' : ''}{t.selectPlan}
            </button>
          </div>
        </div>

        {/* Restore Button */}
        <button className={styles.restoreButton} onClick={handleRestore} disabled={loading}>
          {t.restoreButton}
        </button>

        {/* Terms */}
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