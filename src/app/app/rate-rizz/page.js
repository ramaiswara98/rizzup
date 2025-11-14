// components/RateMyConvo.jsx
'use client';

import { useState, useEffect } from 'react';
import styles from './RateRizz.module.css';
import Link from 'next/link';
import { translations } from '@/translation';

const TOKEN_COST = 30; // Cost to analyze conversation

export default function RateMyConvo() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [rizzScore, setRizzScore] = useState(0);
  const [scoreLabel, setScoreLabel] = useState('');
  const [scoreMessage, setScoreMessage] = useState('');
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [language, setLanguage] = useState('english');
  const [tokens, setTokens] = useState(0);
  const [showInsufficientTokensModal, setShowInsufficientTokensModal] = useState(false);

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Fetch user tokens
    fetchUserTokens();
  }, []);

  const fetchUserTokens = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      const response = await fetch(`/api/user/home?uid=${user.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setTokens(data.data.tokens || 0);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const t = translations[language];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setHasAnalyzed(false); // Reset analysis when new file is uploaded
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleRankMyRizz = async () => {
    if (!uploadedFile) {
      alert(t.rateRizzPage.uploadFirst);
      return;
    }

    // Check if user has enough tokens
    if (tokens < TOKEN_COST) {
      setShowInsufficientTokensModal(true);
      return;
    }

    setIsAnalyzing(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        
        // Call API route
        const response = await fetch('/api/rate-rizz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Data,
            mimeType: uploadedFile.type,
            language: language, // Pass language to API
          }),
        });

        const data = await response.json();
        console.log('AI Analysis:', data);
        
        if (data.success) {
          setRizzScore(data.rizzScore);
          setScoreLabel(data.scoreLabel);
          setScoreMessage(data.scoreMessage);
          setFeedbackItems(data.feedbackItems);
          setHasAnalyzed(true);

          // Deduct tokens after successful analysis
          await deductTokens(data.rizzScore);
        } else {
          alert(t.rateRizzPage.failed);
        }
        
        setIsAnalyzing(false);
      };

      reader.onerror = () => {
        console.error('Error reading file');
        alert(t.rateRizzPage.errorReading);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      alert(t.rateRizzPage.errorAnalyzing);
      setIsAnalyzing(false);
    }
  };

  const deductTokens = async (score) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      console.log('Deducting tokens for conversation rating...');
      console.log('Current tokens before deduction:', tokens);
      console.log('Token cost:', TOKEN_COST);
      console.log('Rizz score:', score);

      const response = await fetch('/api/user/update-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          type: 'conversationRated',
          tokenCost: TOKEN_COST,
          rizzScore: score
        })
      });

      const data = await response.json();
      console.log('Token deduction response:', data);
      
      if (data.success) {
        // Update local token count
        const newTokenBalance = data.tokensRemaining || 0;
        setTokens(newTokenBalance);
        console.log(`Tokens updated: ${newTokenBalance} (deducted ${data.tokensDeducted})`);
      } else {
        console.error('Failed to deduct tokens:', data.error);
      }
    } catch (error) {
      console.error('Error deducting tokens:', error);
    }
  };

  const handleSaveToHistory = async () => {
    console.log('Save to history clicked');
    console.log('Has analyzed:', hasAnalyzed);
    console.log('Rizz score:', rizzScore);
    
    if (!hasAnalyzed) {
      alert(t.rateRizzPage.failed);
      return;
    }

    try {
      const userString = localStorage.getItem('user');
      console.log('User string from localStorage:', userString);
      
      if (!userString) {
        alert('Please login first');
        return;
      }

      const user = JSON.parse(userString);
      console.log('Parsed user:', user);

      const historyData = {
        uid: user.uid,
        type: 'rate-rizz',
        data: {
          rizzScore: rizzScore,
          scoreLabel: scoreLabel,
          scoreMessage: scoreMessage,
          feedbackItems: feedbackItems
        },
        preview: `${t.rateRizzPage.rizzScore}: ${rizzScore}/100 - ${scoreLabel}`,
        imageUrl: previewUrl,
        score: rizzScore
      };

      console.log('Sending history data:', historyData);

      const response = await fetch('/api/user/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyData)
      });

      const data = await response.json();
      console.log('History response:', data);
      
      if (data.success) {
        console.log('History saved successfully');
        alert(t.rateRizzPage.saved);
      } else {
        console.error('Failed to save history:', data);
        alert(t.rateRizzPage.errorSaving);
      }
    } catch (error) {
      console.error('Error saving to history:', error);
      alert(t.rateRizzPage.errorSaving);
    }
  };

  const getScoreBadgeColor = () => {
    if (rizzScore >= 80) return '#4CAF50';
    if (rizzScore >= 60) return '#2196F3';
    if (rizzScore >= 40) return '#FF9800';
    return '#F44336';
  };

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
          <h1 className={styles.title}>{t.rateRizzPage.title}</h1>
          {/* Tokens Display */}
          <div className={styles.tokensDisplay}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#FFA500" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="3" fill="#FFA500"/>
            </svg>
            <span className={styles.tokensNumber}>{tokens}</span>
          </div>
        </header>

        <div className={styles.content}>
          {/* Upload Section */}
          <div className={styles.uploadSection}>
            {previewUrl ? (
              <div className={styles.previewContainer}>
                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                <button 
                  className={styles.removeButton}
                  onClick={() => {
                    setUploadedFile(null);
                    setPreviewUrl(null);
                    setHasAnalyzed(false);
                  }}
                >
                  ✕ {t.rateRizzPage.remove}
                </button>
              </div>
            ) : (
              <>
                <div className={styles.uploadIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" fill="white"/>
                  </svg>
                </div>
                <h2 className={styles.uploadTitle}>{t.rateRizzPage.uploadTitle}</h2>
                <p className={styles.uploadSubtitle}>{t.rateRizzPage.uploadSubtitle}</p>
              </>
            )}
            <input 
              type="file" 
              id="fileInput" 
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button 
              className={styles.chooseFileButton}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {uploadedFile ? t.rateRizzPage.changeFile : t.rateRizzPage.chooseFile}
            </button>
            {uploadedFile && (
              <p className={styles.fileName}>{uploadedFile.name}</p>
            )}
            
            {/* Rank My Rizz Button */}
            {uploadedFile && !hasAnalyzed && (
              <button 
                className={styles.rankButton}
                onClick={handleRankMyRizz}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? t.rateRizzPage.analyzing : `${t.rateRizzPage.rankButton} (${TOKEN_COST} tokens)`}
              </button>
            )}
          </div>

          {/* Rizz Score Section - Only show after analysis */}
          {hasAnalyzed && (
            <>
              <div className={styles.scoreSection}>
                <div className={styles.scoreHeader}>
                  <h3 className={styles.scoreTitle}>{t.rateRizzPage.rizzScore}</h3>
                  <span 
                    className={styles.excellentBadge}
                    style={{ backgroundColor: getScoreBadgeColor() }}
                  >
                    {scoreLabel}
                  </span>
                </div>
                
                <div className={styles.scoreCircleContainer}>
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    {/* Gray background dashed circle */}
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke="#E0E0E0"
                      strokeWidth="14"
                      strokeDasharray="8 6"
                      strokeLinecap="round"
                    />
                    {/* Blue progress dashed circle */}
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="14"
                      strokeDasharray={`${(440 * rizzScore) / 100} ${440 - (440 * rizzScore) / 100}`}
                      strokeLinecap="round"
                      transform="rotate(-90 90 90)"
                    />
                  </svg>
                  <div className={styles.scoreText}>
                    <div className={styles.scoreNumber}>{rizzScore}</div>
                    <div className={styles.scoreMax}>/100</div>
                  </div>
                </div>

                <p className={styles.scoreMessage}>
                  {scoreMessage}
                </p>
              </div>

              {/* AI Feedback Section */}
              <div className={styles.feedbackSection}>
                <h3 className={styles.feedbackTitle}>{t.rateRizzPage.aiFeedback}</h3>
                
                {feedbackItems.map((item, index) => (
                  <div key={index} className={styles.feedbackItem}>
                    <div 
                      className={styles.feedbackIcon}
                      style={{ 
                        backgroundColor: item.iconBg,
                        color: item.iconColor 
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className={styles.feedbackContent}>
                      <h4 className={styles.feedbackItemTitle}>{item.title}</h4>
                      <p className={styles.feedbackItemDescription}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className={styles.loadingState}>
              <p>{t.rateRizzPage.analyzing2}</p>
            </div>
          )}
        </div>

        {/* Bottom Actions - Only show after analysis */}
        {hasAnalyzed && (
          <div className={styles.bottomActions}>
            <button 
              className={styles.saveButton}
              onClick={handleSaveToHistory}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
              </svg>
              {t.rateRizzPage.saveToHistory}
            </button>
          </div>
        )}

        {/* Insufficient Tokens Modal */}
        {showInsufficientTokensModal && (
          <div className={styles.modalOverlay} onClick={() => setShowInsufficientTokensModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#FF9500" strokeWidth="2" fill="none"/>
                  <path d="M12 8v4M12 16h.01" stroke="#FF9500" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className={styles.modalTitle}>Insufficient Tokens</h3>
              <p className={styles.modalText}>
                You need {TOKEN_COST} tokens to analyze your conversation, but you only have {tokens} tokens remaining.
              </p>
              <p className={styles.modalText}>
                Please upgrade your plan or purchase more tokens to continue.
              </p>
              <div className={styles.modalButtons}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowInsufficientTokensModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={() => {
                    setShowInsufficientTokensModal(false);
                    window.location.href = '/app/profile';
                  }}
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}