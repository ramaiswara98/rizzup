// components/RateMyConvo.jsx
'use client';

import { useState, useEffect } from 'react';
import styles from './RateRizz.module.css';
import Link from 'next/link';
import { translations } from '@/translation';

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

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

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

  const handleCopyTips = () => {
    const tipsText = feedbackItems.map(item => 
      `${item.title}\n${item.description}`
    ).join('\n\n');
    navigator.clipboard.writeText(tipsText);
    alert(t.rateRizzPage.tipsCopied);
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
          <button className={styles.historyButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" fill="currentColor"/>
            </svg>
          </button>
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
                {isAnalyzing ? t.rateRizzPage.analyzing : t.rateRizzPage.rankButton}
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
            <button className={styles.saveButton}>{t.rateRizzPage.saveButton}</button>
            <div className={styles.secondaryActions}>
              <button className={styles.copyButton} onClick={handleCopyTips}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
                {t.rateRizzPage.copyTips}
              </button>
              <button className={styles.shareButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}