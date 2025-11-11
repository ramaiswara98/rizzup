// components/SuggestedReply.jsx
'use client';

import { useState, useEffect } from 'react';
import styles from './SuggestedReply.module.css';
import Link from 'next/link';
import { translations } from '@/translation';


export default function SuggestedReply() {
  const [selectedTone, setSelectedTone] = useState('confident');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
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

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert(t.suggestedReplyPage.copied);
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
              {isGenerating ? t.suggestedReplyPage.generating : t.suggestedReplyPage.generateButton}
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

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          <button className={styles.copyAndSendButton}>{t.suggestedReplyPage.copyAndSend}</button>
          <button className={styles.saveToHistoryButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
            {t.suggestedReplyPage.saveToHistory}
          </button>
        </div>
      </div>
    </div>
  );
}