'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, CreditCard, Sparkles } from 'lucide-react';
import styles from './Paywall.module.css';

export default function PaywallPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate loading page
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const plans = [
    {
      name: 'Charm',
      description: 'Starter pack to unlock daily rizz scenarios',
      price: '$4.99 / month',
      icon: <Sparkles size={24} style={styles.icon}/>,
      benefit: '1500 Tokens',
    },
    {
      name: 'Aura',
      description: 'Unlimited rizz potential with all features',
      price: '$14.99 / month',
      icon: <CreditCard size={24} style={styles.icon}/>,
      benefit: '5000 Tokens',
    },
  ];

  if (loading) {
    return (
      <div className={styles.phoneFrame}>
        <div className={styles.container}>
          <div className={styles.loaderPage}>
            <div className={styles.loader}></div>
            <p>Loading RizzUp...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Unlock Your RizzUp Power</h1>
        </div>

        <div className={styles.welcome}>
          <h2 className={styles.welcomeTitle}>Choose your plan</h2>
          <p className={styles.welcomeSubtitle}>
            Get full access to RizzUp and start mastering your chat game!
          </p>
        </div>

        <div className={styles.features}>
          {plans.map((plan, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={`${styles.iconContainer} ${idx === 0 ? 'blue' : 'orange'}`}>
                {plan.icon}
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{plan.name}</h3>
                <p className={styles.featureDescription}>{plan.description}</p>
                <p className={styles.featureDescription}><strong>{plan.price}</strong></p>
                <p className={styles.featureDescription}>{plan.benefit}</p>
              </div>
              {/* <button className={styles.chooseButton}>
                Choose Plan <ArrowRight size={18} />
              </button> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
