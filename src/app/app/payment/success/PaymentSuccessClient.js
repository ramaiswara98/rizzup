// app/payment/success/PaymentSuccessClient.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './PaymentSuccess.module.css';

export default function PaymentSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
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
        <h1>Payment Successful!</h1>
        <p>Thank you for subscribing to {selectedPlan.name}</p>
        <p>Redirecting in {countdown} seconds...</p>
        <button onClick={() => router.push('/app/home')}>Go Home Now</button>
      </div>
    </div>
  );
}
