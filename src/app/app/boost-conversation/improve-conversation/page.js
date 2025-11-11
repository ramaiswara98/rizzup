// components/ImproveConversation.jsx
'use client';

import { useState } from 'react';
import styles from './ImproveConversation.module.css';
import Link from 'next/link';

export default function ImproveConversation() {
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const suggestions = [
    {
      text: "That's so cool! I'd love to hear more about that sometime. What got you into it?",
      description: "Shows genuine interest and keeps the conversation flowing"
    },
    {
      text: "Wow, you have great taste! That sounds like something I'd enjoy too 😊",
      description: "Compliment with a hint of common interest"
    },
    {
      text: "Haha, you're making me want to try that now! Any beginner tips?",
      description: "Use humor to keep it playful and ask for advice"
    }
  ];

  const handleSelectSuggestion = (index) => {
    setSelectedSuggestion(index);
  };

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link 
            className={styles.backButton}
            href={'/app/boost-conversation'}
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
            </svg>
          </Link>
          <h1 className={styles.title}>Improve Conversation</h1>
          <button className={styles.historyButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" fill="currentColor"/>
            </svg>
          </button>
        </header>

        <div className={styles.content}>
          {/* Upload Section */}
          <div className={styles.uploadSection}>
            <div className={styles.uploadIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3h-1v2h1c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#999"/>
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" fill="#999"/>
              </svg>
            </div>
            <p className={styles.uploadText}>
              Upload your chat screenshot or<br />paste the conversation here
            </p>
            <div className={styles.uploadButtons}>
              <button className={styles.uploadButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white"/>
                </svg>
                Upload
              </button>
              <button className={styles.pasteButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z" fill="currentColor"/>
                </svg>
                Paste
              </button>
            </div>
          </div>

          {/* Tone Selection */}
          <div className={styles.toneSection}>
            <h3 className={styles.sectionTitle}>Choose Your Tone</h3>
            <div className={styles.toneButtons}>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'friendly' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('friendly')}
              >
                Friendly
              </button>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'confident' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('confident')}
              >
                Confident
              </button>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'flirty' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('flirty')}
              >
                Flirty
              </button>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className={styles.suggestionsSection}>
            <h3 className={styles.sectionTitle}>AI Suggestions</h3>
            
            {suggestions.map((suggestion, index) => (
              <div key={index} className={styles.suggestionCard}>
                <p className={styles.suggestionText}>{suggestion.text}</p>
                <div className={styles.suggestionActions}>
                  <button 
                    className={`${styles.selectButton} ${selectedSuggestion === index ? styles.selectedButton : ''}`}
                    onClick={() => handleSelectSuggestion(index)}
                  >
                    Select
                  </button>
                  <button className={styles.copyButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                    </svg>
                    Copy
                  </button>
                </div>
                <p className={styles.suggestionDescription}>{suggestion.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          <button className={styles.copyAndSendButton}>Copy & Send</button>
          <button className={styles.saveToHistoryButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
            Save to History
          </button>
        </div>
      </div>
    </div>
  );
}