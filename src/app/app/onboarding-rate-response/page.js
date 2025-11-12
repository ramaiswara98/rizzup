'use client';

import { useState, useEffect } from 'react';
import { Send, RefreshCw, ThumbsUp, ArrowRight } from 'lucide-react';
import styles from './OnboardingRateResponse.module.css';
import { translations } from '@/translation';
import Link from 'next/link';

export default function RateResponsePage() {
  const [language, setLanguage] = useState('english');
  const [scenario, setScenario] = useState(null);
  const [userReply, setUserReply] = useState('');
  const [aiRating, setAiRating] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true); // start loading immediately
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasReplied, setHasReplied] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) setLanguage(savedLanguage);

    // Generate scenario automatically on page load
    generateScenario(savedLanguage);
  }, []);

  const t = translations[language].rateResponsePage;

  const generateScenario = async (language) => {
    setIsGenerating(true);
    setScenario(null);
    setUserReply('');
    setAiRating(null);
    setHasReplied(false);

    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language })
      });

      const data = await response.json();

      if (data.success) {
        setScenario(data.scenario);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error generating scenario:', error);

      // Fallback scenario without name
      setScenario({
        context: language === 'english'
          ? "Someone new you’ve been chatting with"
          : "Seseorang baru yang mulai sering chat denganmu",
        message: language === 'english'
          ? "You make texting way too fun. Are you like this in person too?"
          : "Kamu bikin chatting jadi seru banget. Aslinya juga segini asik nggak?",
        situation: language === 'english'
          ? "They’re playfully flirting to keep the vibe going."
          : "Dia sedang menggoda dengan cara halus dan ramah."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!userReply.trim()) return;

    setIsAnalyzing(true);
    setHasReplied(true);

    try {
      const response = await fetch('/api/rate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          scenario,
          userReply
        })
      });

      const data = await response.json();

      if (data.success) {
        setAiRating(data.rating);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error analyzing reply:', error);

      setAiRating({
        score: 50,
        rating: language === 'english' ? "Average" : "Rata-rata",
        emoji: "💭",
        summary: language === 'english' ? "Standard reply" : "Balasan standar",
        strengths: [language === 'english' ? "Clear message" : "Pesan jelas"],
        improvements: [language === 'english' ? "Add more personality" : "Tambah kepribadian"],
        suggestion: language === 'english'
          ? "Try to be more specific and engaging in your responses."
          : "Coba lebih spesifik dan engaging dalam responmu."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return styles.scoreGreen;
    if (score >= 60) return styles.scoreBlue;
    if (score >= 40) return styles.scoreOrange;
    return styles.scoreRed;
  };

  const getScoreBg = (score) => {
    if (score >= 80) return styles.scoreBgGreen;
    if (score >= 60) return styles.scoreBgBlue;
    if (score >= 40) return styles.scoreBgOrange;
    return styles.scoreBgRed;
  };

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          {isGenerating ? (
            // Loading animation inside chat area
            <div className={styles.loadingContainer}>
              <RefreshCw className={styles.spinning} size={40} />
              <p>{t.generating}...</p>
            </div>
          ) : scenario && (
            <>
              {/* Scenario Context */}
              <div className={styles.contextBox}>
                <p className={styles.contextLabel}>{t.scenarioContext}</p>
                <p className={styles.contextText}>{scenario.context}</p>
                <p className={styles.contextSituation}>{scenario.situation}</p>
              </div>

              {/* Their Message Bubble */}
              <div className={styles.messageLeft}>
                <div className={styles.avatarThem}>💬</div>
                <div className={styles.messageContent}>
                  <p className={styles.messageName}>{t.them}</p>
                  <div className={styles.bubbleThem}>
                    <p>{scenario.message}</p>
                  </div>
                </div>
              </div>

              {/* User Reply Bubble */}
              {hasReplied && (
                <div className={styles.messageRight}>
                  <div className={styles.messageContent}>
                    <p className={styles.messageName}>{t.you}</p>
                    <div className={styles.bubbleYou}>
                      <p>{userReply}</p>
                    </div>
                  </div>
                  <div className={styles.avatarYou}>Y</div>
                </div>
              )}

              {/* Reply Input */}
              {!hasReplied && (
                <div className={styles.replyBox}>
                  <textarea
                    value={userReply}
                    onChange={(e) => setUserReply(e.target.value)}
                    placeholder={t.typeReply}
                    className={styles.textarea}
                    rows={3}
                    disabled={isAnalyzing}
                  />
                  <button
                    onClick={handleSubmitReply}
                    disabled={!userReply.trim() || isAnalyzing}
                    className={styles.sendButton}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className={styles.spinning} size={20} />
                        {t.analyzing}
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        {t.send}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* AI Rating */}
              {aiRating && (
                <div className={styles.ratingBox}>
                  <div className={styles.ratingHeader}>
                    <ThumbsUp size={24} />
                    <h3>{t.aiFeedback}</h3>
                  </div>

                  <div className={`${styles.scoreCard} ${getScoreBg(aiRating.score)}`}>
                    <div className={styles.scoreContent}>
                      <div>
                        <p className={styles.scoreLabel}>{t.score}</p>
                        <p className={`${styles.scoreNumber} ${getScoreColor(aiRating.score)}`}>
                          {aiRating.score}/100
                        </p>
                        <p className={`${styles.scoreRating} ${getScoreColor(aiRating.score)}`}>
                          {aiRating.rating}
                        </p>
                      </div>
                      <div className={styles.scoreEmoji}>{aiRating.emoji}</div>
                    </div>
                    <p className={styles.scoreSummary}>{aiRating.summary}</p>
                  </div>

                  {aiRating.strengths?.length > 0 && (
                    <div className={styles.feedbackSection}>
                      <p className={styles.strengthsTitle}>✓ {t.strengths}</p>
                      <ul>
                        {aiRating.strengths.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiRating.improvements?.length > 0 && (
                    <div className={styles.feedbackSection}>
                      <p className={styles.improvementsTitle}>⚡ {t.improvements}</p>
                      <ul>
                        {aiRating.improvements.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiRating.suggestion && (
                    <div className={styles.suggestionBox}>
                      <p className={styles.suggestionTitle}>💡 {t.suggestion}</p>
                      <p className={styles.suggestionText}>{aiRating.suggestion}</p>
                    </div>
                  )}

                  <Link
                    href={'/app/home'}
                    className={styles.nextButton}
                  >
                    {t.nextScenario}
                    <ArrowRight size={20} />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
