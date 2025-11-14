// components/SuggestedReply.jsx
'use client';

import { useState, useEffect } from 'react';
import styles from './SuggestedReply.module.css';
import Link from 'next/link';
import { translations } from '@/translation';

const TOKEN_COST = 30; // Cost to generate suggestions

export default function SuggestedReply() {
  const [selectedTone, setSelectedTone] = useState('confident');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
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
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!uploadedFile) {
      alert(t.suggestedReplyPage.uploadFirst);
      return;
    }

    // Check if user has enough tokens
    if (tokens < TOKEN_COST) {
      setShowInsufficientTokensModal(true);
      return;
    }

    setIsGenerating(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        
        // Call your API route
        const response = await fetch('/api/generate-reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Data,
            mimeType: uploadedFile.type,
            tone: selectedTone,
            language: language, // Pass language to API
          }),
        });

        const data = await response.json();
        console.log('AI Response:', data);
        
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
          
          // Deduct tokens after successful generation
          await deductTokens();
        } else {
          alert(t.suggestedReplyPage.failed);
        }
        
        setIsGenerating(false);
      };

      reader.onerror = () => {
        console.error('Error reading file');
        alert(t.suggestedReplyPage.failed);
        setIsGenerating(false);
      };
    } catch (error) {
      console.error('Error generating suggestions:', error);
      alert(t.suggestedReplyPage.failed);
      setIsGenerating(false);
    }
  };

  const deductTokens = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      const response = await fetch('/api/user/update-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          type: 'suggestionUsed',
          tokenCost: TOKEN_COST
        })
      });

      const data = await response.json();
      
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

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert(t.suggestedReplyPage.copied);
  };

  const handleSaveToHistory = async () => {
    if (suggestions.length === 0) {
      alert(t.suggestedReplyPage.failed);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login first');
        return;
      }

      const response = await fetch('/api/user/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          type: 'suggested-reply',
          data: { 
            suggestions: suggestions, 
            tone: selectedTone 
          },
          preview: suggestions[0]?.text || 'AI suggestions generated',
          imageUrl: previewUrl
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(t.suggestedReplyPage.saved);
      } else {
        alert(t.suggestedReplyPage.errorSaving);
      }
    } catch (error) {
      console.error('Error saving to history:', error);
      alert(t.suggestedReplyPage.errorSaving);
    }
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
          <h1 className={styles.title}>{t.suggestedReplyPage.title}</h1>
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
                  }}
                >
                  ✕ {t.suggestedReplyPage.remove}
                </button>
              </div>
            ) : (
              <>
                <div className={styles.uploadIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white"/>
                  </svg>
                </div>
                <h2 className={styles.uploadTitle}>{t.suggestedReplyPage.uploadTitle}</h2>
                <p className={styles.uploadSubtitle}>{t.suggestedReplyPage.uploadSubtitle}</p>
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
              {uploadedFile ? t.suggestedReplyPage.changeFile : t.suggestedReplyPage.chooseFile}
            </button>
            {uploadedFile && (
              <p className={styles.fileName}>{uploadedFile.name}</p>
            )}
          </div>

          {/* Tone Selection */}
          <div className={styles.toneSection}>
            <h3 className={styles.sectionTitle}>{t.suggestedReplyPage.chooseTone}</h3>
            <div className={styles.toneButtons}>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'friendly' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('friendly')}
              >
                {t.suggestedReplyPage.tones.friendly}
              </button>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'confident' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('confident')}
              >
                {t.suggestedReplyPage.tones.confident}
              </button>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'flirty' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('flirty')}
              >
                {t.suggestedReplyPage.tones.flirty}
              </button>
            </div>
            
            {/* Generate Button */}
            <button 
              className={styles.generateButton}
              onClick={handleGenerateSuggestions}
              disabled={isGenerating || !uploadedFile}
            >
              {isGenerating ? t.suggestedReplyPage.generating : `${t.suggestedReplyPage.generateButton} (${TOKEN_COST} tokens)`}
            </button>
          </div>

          {/* AI Suggestions */}
          {(suggestions.length > 0 || isGenerating) && (
            <div className={styles.suggestionsSection}>
              <h3 className={styles.sectionTitle}>{t.suggestedReplyPage.aiSuggestions}</h3>
              
              {isGenerating ? (
                <div className={styles.loadingState}>
                  <p>{t.suggestedReplyPage.analyzing}</p>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div key={index} className={styles.suggestionCard}>
                    <p className={styles.suggestionText}>{suggestion.text}</p>
                    <div className={styles.suggestionActions}>
                      <button className={styles.selectButton}>{t.suggestedReplyPage.select}</button>
                      <button 
                        className={styles.copyButton}
                        onClick={() => handleCopyText(suggestion.text)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                        </svg>
                        {t.suggestedReplyPage.copy}
                      </button>
                    </div>
                    <p className={styles.suggestionDescription}>{suggestion.description}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions - REPLACED WITH SAVE TO HISTORY ONLY */}
        {suggestions.length > 0 && (
          <div className={styles.bottomActions}>
            <button 
              className={styles.saveToHistoryButton}
              onClick={handleSaveToHistory}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
              </svg>
              {t.suggestedReplyPage.saveToHistory}
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
                You need {TOKEN_COST} tokens to generate suggestions, but you only have {tokens} tokens remaining.
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
                    // TODO: Navigate to upgrade/purchase page
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