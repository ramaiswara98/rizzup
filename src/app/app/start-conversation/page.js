// components/StartConversation.jsx
'use client';

import { useState, useEffect } from 'react';
import styles from './StartConversation.module.css';
import Link from 'next/link';
import { translations } from '@/translation';

const TOKEN_COST = 10; // Cost to generate conversation starters

export default function StartConversation() {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Friend');
  const [topic, setTopic] = useState('');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
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

  const handleGenerate = async () => {
    if (!name.trim()) {
      alert(t.startConversationPage.enterName);
      return;
    }

    // Check if user has enough tokens
    if (tokens < TOKEN_COST) {
      setShowInsufficientTokensModal(true);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/start-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          relation: relation,
          topic: topic.trim() || null, // Send null if empty so AI can suggest
          tone: selectedTone,
          language: language, // Pass language to API
        }),
      });

      const data = await response.json();
      console.log('AI Response:', data);

      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
        // If AI suggested a topic, update the input
        if (data.suggestedTopic && !topic.trim()) {
          setTopic(data.suggestedTopic);
        }

        // Deduct tokens after successful generation
        await deductTokens();
      } else {
        alert(t.startConversationPage.failed);
      }

      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      alert(t.startConversationPage.errorGenerating);
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
          type: 'conversationStarted',
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

  const handleSelectSuggestion = (index) => {
    setSelectedSuggestion(index);
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert(t.startConversationPage.copied);
  };

  const handleSaveToHistory = async () => {
    console.log('Save to history clicked');
    console.log('Suggestions:', suggestions);
    console.log('Name:', name);
    
    if (suggestions.length === 0) {
      alert(t.startConversationPage.failed);
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
        type: 'start-conversation',
        data: { 
          name: name,
          relation: relation,
          topic: topic,
          tone: selectedTone,
          suggestions: suggestions 
        },
        preview: `Conversation with ${name}: ${suggestions[0]?.text || ''}`
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
        alert(t.startConversationPage.saved);
      } else {
        console.error('Failed to save history:', data);
        alert(t.startConversationPage.errorSaving);
      }
    } catch (error) {
      console.error('Error saving to history:', error);
      alert(t.startConversationPage.errorSaving);
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
          <h1 className={styles.title}>{t.startConversationPage.title}</h1>
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
          {/* Name Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>{t.startConversationPage.nameLabel}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={t.startConversationPage.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Relation Dropdown */}
          <div className={styles.formGroup}>
            <label className={styles.label}>{t.startConversationPage.relationLabel}</label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
              >
                <option value="Friend">{t.startConversationPage.relations.friend}</option>
                <option value="Partner">{t.startConversationPage.relations.partner}</option>
                <option value="Colleague">{t.startConversationPage.relations.colleague}</option>
                <option value="Family">{t.startConversationPage.relations.family}</option>
                <option value="Crush">{t.startConversationPage.relations.crush}</option>
              </select>
              <svg className={styles.selectArrow} width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 10l5 5 5-5z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Topic Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>{t.startConversationPage.topicLabel}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={t.startConversationPage.topicPlaceholder}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Tone Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>{t.startConversationPage.toneLabel}</label>
            <div className={styles.toneButtons}>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'friendly' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('friendly')}
              >
                {t.startConversationPage.tones.friendly}
              </button>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'confident' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('confident')}
              >
                {t.startConversationPage.tones.confident}
              </button>
              <button 
                className={`${styles.toneButton} ${selectedTone === 'flirty' ? styles.selected : ''}`}
                onClick={() => setSelectedTone('flirty')}
              >
                {t.startConversationPage.tones.flirty}
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button 
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={isGenerating || !name.trim()}
          >
            {isGenerating ? t.startConversationPage.generating : `${t.startConversationPage.generateButton} (${TOKEN_COST} tokens)`}
          </button>

          {/* AI Suggestions */}
          {(suggestions.length > 0 || isGenerating) && (
            <div className={styles.suggestionsSection}>
              <h3 className={styles.sectionTitle}>{t.startConversationPage.aiSuggestions}</h3>
              
              {isGenerating ? (
                <div className={styles.loadingState}>
                  <p>{t.startConversationPage.generatingMessage}</p>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div key={index} className={styles.suggestionCard}>
                    <p className={styles.suggestionText}>{suggestion.text}</p>
                    <div className={styles.suggestionActions}>
                      <button 
                        className={`${styles.selectButton} ${selectedSuggestion === index ? styles.selectedButton : ''}`}
                        onClick={() => handleSelectSuggestion(index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                        </svg>
                        {selectedSuggestion === index ? t.startConversationPage.selected : t.startConversationPage.select}
                      </button>
                      <button 
                        className={styles.copyButton}
                        onClick={() => handleCopyText(suggestion.text)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                        </svg>
                        {t.startConversationPage.copy}
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
              {t.startConversationPage.saveToHistory}
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
                You need {TOKEN_COST} tokens to generate conversation starters, but you only have {tokens} tokens remaining.
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