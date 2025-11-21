// components/RizzUpHistory.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './History.module.css';
import { translations } from '@/translation';
import Image from 'next/image';

export default function RizzUpHistory() {
  const [language, setLanguage] = useState('english');
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Get user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchHistory(JSON.parse(savedUser).uid);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchHistory = async (uid) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/history?uid=${uid}`);
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId || !user) return;

    try {
      const response = await fetch('/api/user/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          historyId: deleteItemId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setHistory(history.filter(item => item._id !== deleteItemId));
        alert(t.deleted);
      } else {
        alert(t.errorDelete);
      }
    } catch (error) {
      console.error('Error deleting history:', error);
      alert(t.errorDelete);
    } finally {
      setShowDeleteModal(false);
      setDeleteItemId(null);
    }
  };

  const handleViewDetails = (item) => {
    console.log('View details clicked for:', item);
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const renderDetailsContent = () => {
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case 'suggested-reply':
        return (
          <div className={styles.detailsContent}>
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsLabel}>Tone:</h4>
              <p className={styles.detailsText}>{selectedItem.data?.tone || 'N/A'}</p>
            </div>
            {selectedItem.imageUrl && (
              <div className={styles.detailsSection}>
                <h4 className={styles.detailsLabel}>Image:</h4>
                <img src={selectedItem.imageUrl} alt="Story" className={styles.detailsImage} />
              </div>
            )}
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsLabel}>AI Suggestions:</h4>
              {selectedItem.data?.suggestions?.map((suggestion, index) => (
                <div key={index} className={styles.suggestionDetail}>
                  <p className={styles.suggestionText}>{suggestion.text}</p>
                  <p className={styles.suggestionDesc}>{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'start-conversation':
        return (
          <div className={styles.detailsContent}>
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsLabel}>Tone:</h4>
              <p className={styles.detailsText}>{selectedItem.data?.tone || 'N/A'}</p>
            </div>
            {selectedItem.imageUrl && (
              <div className={styles.detailsSection}>
                <h4 className={styles.detailsLabel}>Image:</h4>
                <img src={selectedItem.imageUrl} alt="Story" className={styles.detailsImage} />
              </div>
            )}
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsLabel}>AI Suggestions:</h4>
              {selectedItem.data?.suggestions?.map((suggestion, index) => (
                <div key={index} className={styles.suggestionDetail}>
                  <p className={styles.suggestionText}>{suggestion.text}</p>
                  <p className={styles.suggestionDesc}>{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rate-rizz':
        return (
          <div className={styles.detailsContent}>
            {selectedItem.imageUrl && (
              <div className={styles.detailsSection}>
                <h4 className={styles.detailsLabel}>Chat Screenshot:</h4>
                <img src={selectedItem.imageUrl} alt="Chat" className={styles.detailsImage} />
              </div>
            )}
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsLabel}>Rizz Score:</h4>
              <p className={styles.detailsScore}>{selectedItem.data?.rizzScore}/100 - {selectedItem.data?.scoreLabel}</p>
            </div>
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsLabel}>Analysis:</h4>
              <p className={styles.detailsText}>{selectedItem.data?.scoreMessage}</p>
            </div>
            <div className={styles.detailsSection}>
              <h4 className={styles.detailsLabel}>Feedback:</h4>
              {selectedItem.data?.feedbackItems?.map((item, index) => (
                <div key={index} className={styles.feedbackDetail}>
                  <div className={styles.feedbackIcon} style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                    {item.icon}
                  </div>
                  <div>
                    <h5 className={styles.feedbackTitle}>{item.title}</h5>
                    <p className={styles.feedbackDesc}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <p>No details available</p>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'suggested-reply':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#2196F3"/>
          </svg>
        );
      case 'start-conversation':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13.5 2L10 8H4L8 12L6 18L13.5 22L21 18L19 12L23 8H17L13.5 2Z" fill="#FF9800"/>
          </svg>
        );
      case 'rate-rizz':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#9C27B0"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'suggested-reply':
        return t.suggestedReply;
      case 'start-conversation':
        return t.startConversation;
      case 'rate-rizz':
        return t.rateRizz;
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t.today;
    if (diffDays === 1) return t.yesterday;
    if (diffDays < 7) return t.thisWeek;
    
    return date.toLocaleDateString(language === 'indonesia' ? 'id-ID' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const groupHistoryByDate = () => {
    const grouped = {};
    
    history.forEach(item => {
      const dateLabel = formatDate(item.createdAt);
      if (!grouped[dateLabel]) {
        grouped[dateLabel] = [];
      }
      grouped[dateLabel].push(item);
    });
    
    return grouped;
  };

  const t = translations[language].historyPage;

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const groupedHistory = groupHistoryByDate();

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <Link className={styles.backButton} href="/app/home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
            </svg>
          </Link>
          <h1 className={styles.title}>{t.title}</h1>
          <div className={styles.placeholder}></div>
        </header>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loadingState}>
              {/* <div className={styles.spinner}></div> */}
              <Image 
                          src="/svg/loading.svg" 
                          alt="Loading" 
                          width={100} 
                          height={100} 
                        />
            </div>
          ) : history.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <h3 className={styles.emptyTitle}>{t.noHistory}</h3>
              <p className={styles.emptyDesc}>{t.noHistoryDesc}</p>
            </div>
          ) : (
            Object.entries(groupedHistory).map(([dateLabel, items]) => (
              <div key={dateLabel} className={styles.historyGroup}>
                <h3 className={styles.dateLabel}>{dateLabel}</h3>
                {items.map((item) => (
                  <div key={item._id} className={styles.historyCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.typeInfo}>
                        <div className={styles.typeIcon}>
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <div className={styles.typeLabel}>{getTypeLabel(item.type)}</div>
                          <div className={styles.timeLabel}>
                            {new Date(item.createdAt).toLocaleTimeString(
                              language === 'indonesia' ? 'id-ID' : 'en-US',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </div>
                        </div>
                      </div>
                      {item.score && (
                        <div className={styles.scoreBadge}>
                          <span className={styles.scoreLabel}>{t.score}:</span>
                          <span className={styles.scoreValue}>{item.score}</span>
                        </div>
                      )}
                    </div>

                    {item.preview && (
                      <div className={styles.cardPreview}>
                        {item.preview}
                      </div>
                    )}

                    {item.imageUrl && (
                      <div className={styles.cardImage}>
                        <img src={item.imageUrl} alt="History preview" />
                      </div>
                    )}

                    <div className={styles.cardActions}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => handleViewDetails(item)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                        </svg>
                        {t.viewDetails}
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => {
                          setDeleteItemId(item._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                        {t.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>{t.delete}</h3>
              <p className={styles.modalText}>{t.deleteConfirm}</p>
              <div className={styles.modalButtons}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteItemId(null);
                  }}
                >
                  {t.cancel}
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={handleDelete}
                >
                  {t.confirmDelete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedItem && (
          <div className={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
            <div className={styles.detailsModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.detailsModalHeader}>
                <h3 className={styles.detailsModalTitle}>
                  {getTypeLabel(selectedItem.type)}
                </h3>
                <button 
                  className={styles.closeButton}
                  onClick={() => setShowDetailsModal(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
              <div className={styles.detailsModalBody}>
                {renderDetailsContent()}
              </div>
            </div>
          </div>
        )}

       
      </div>
    </div>
  );
}