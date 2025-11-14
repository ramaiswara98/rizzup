// app/payment/success/PaymentSuccessClient.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './PaymentSuccess.module.css';

export default function PaymentSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams?.get('plan');

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/app/home');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const planDetails = {
    charm: { name: 'Charm Plan', tokens: '1,500', icon: '✨' },
    aura: { name: 'Aura Plan', tokens: '5,000', icon: '🔥' },
  };

  const selectedPlan = planDetails[plan] || planDetails.aura;

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.iconWrapper}>
          <div className={styles.successIcon}>✓</div>
        </div>

        <h1 className={styles.title}>Payment Successful!</h1>
        <p className={styles.subtitle}>
          Thank you for subscribing to the {selectedPlan.name}
        </p>

        <div className={styles.planInfo}>
          <div className={styles.planIcon}>{selectedPlan.icon}</div>
          <div className={styles.planDetails}>
            <h3>{selectedPlan.name}</h3>
            <p>{selectedPlan.tokens} tokens/month</p>
          </div>
        </div>

        <div className={styles.messageBox}>
          <p>Your subscription is now active!</p>
          <p>You can start using your tokens right away.</p>
        </div>

        <div className={styles.redirectInfo}>
          Redirecting to home in {countdown} seconds...
        </div>

        <button
          className={styles.homeButton}
          onClick={() => router.push('/app/home')}
        >
          Go to Home Now
        </button>
      </div>
    </div>
  );
}
