// components/StartConversation.jsx
'use client';

import { useState, useEffect } from 'react';
import styles from './StartConversation.module.css';
import Link from 'next/link';
import { translations } from '@/translation';

export default function StartConversation() {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Friend');
  const [topic, setTopic] = useState('');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
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

  const handleGenerate = async () => {
    if (!name.trim()) {
      alert(t.startConversationPage.enterName);
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

  const handleSelectSuggestion = (index) => {
    setSelectedSuggestion(index);
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    alert(t.startConversationPage.copied);
  };

  const handleCopyAndSend = () => {
    if (selectedSuggestion !== null) {
      const text = suggestions[selectedSuggestion].text;
      navigator.clipboard.writeText(text);
      alert(t.startConversationPage.copiedSend);
    } else {
      alert(t.startConversationPage.selectFirst);
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
          <button className={styles.historyButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" fill="currentColor"/>
            </svg>
          </button>
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
            {isGenerating ? t.startConversationPage.generating : t.startConversationPage.generateButton}
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

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          <button 
            className={styles.copyAndSendButton}
            onClick={handleCopyAndSend}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white"/>
            </svg>
            {t.startConversationPage.copyAndSend}
          </button>
          <button className={styles.saveToHistoryButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
            </svg>
            {t.startConversationPage.saveToHistory}
          </button>
        </div>
      </div>
    </div>
  );
}