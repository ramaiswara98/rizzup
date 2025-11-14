'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Star, Check, X, MessageCircle, TrendingUp, Shield, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('english');
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
    setLanguage(savedLanguage);
  }, []);

  const translations = {
    english: {
      logo: "RizzUp",
      badge: "🔥 10,000+ Users Already Winning",
      heroTitle: "Never Run Out of Things to Say Again",
      heroSubtitle: "AI-powered conversation coach that turns awkward silences into confident connections. Get instant reply suggestions, conversation starters, and expert feedback—all in 3 seconds.",
      ctaPrimary: "Start Free Now",
      trustText: "Join 10K+ users",
      floatingCard1: "Perfect reply in 3 sec",
      floatingCard2: "AI analyzes context",
      floatingCard3: "Level up instantly",
      
      problem: {
        title: "Tired of These Conversation Killers?",
        points: [
          "Staring at your screen for 10 minutes, not knowing what to reply",
          "Overthinking every single message until it's too late",
          "Conversation dies because you ran out of things to say",
          "Cringe at your own messages the next day"
        ]
      },
      
      solution: {
        title: "Here's What Changes With RizzUp",
        points: [
          "Get 3-5 perfect reply options in under 3 seconds",
          "AI reads tone, context & personality automatically",
          "Never run out of conversation topics again",
          "Send every message with confidence"
        ]
      },
      
      howItWorks: {
        title: "So Simple, You'll Wonder Why You Didn't Start Sooner",
        steps: [
          { 
            number: "1", 
            title: "Upload & Share", 
            description: "Drop a screenshot, Instagram story, or just describe your situation. Takes 5 seconds.",
            icon: "📤"
          },
          { 
            number: "2", 
            title: "AI Works Its Magic", 
            description: "Our AI analyzes tone, context, personality, and conversation history to craft perfect responses.",
            icon: "🤖"
          },
          { 
            number: "3", 
            title: "Pick & Send", 
            description: "Choose from 3-5 tailored suggestions or mix them. Hit send with confidence.",
            icon: "✨"
          },
        ]
      },
      
      features: [
        {
          icon: "⚡",
          title: "Instant Reply Suggestions",
          description: "Upload any screenshot or story. Get 3-5 tailored reply options in under 3 seconds. No more blank screen anxiety.",
          benefit: "Save 10+ min per chat"
        },
        {
          icon: "🎯",
          title: "Context-Aware AI",
          description: "Our AI reads between the lines—understanding tone, emotion, and history to give you spot-on suggestions every time.",
          benefit: "95% accuracy rate"
        },
        {
          icon: "💡",
          title: "Conversation Starters",
          description: "Breaking the ice or reviving a dead chat? Get creative, engaging openers for any situation. Never awkward again.",
          benefit: "Ice breaker guaranteed"
        },
        {
          icon: "📈",
          title: "Honest AI Feedback",
          description: "Upload chat screenshots and get rated with actionable tips. Track your improvement and see yourself level up over time.",
          benefit: "Data-driven growth"
        },
      ],
      
      social: {
        title: "Trusted by 10,000+ People Just Like You",
        subtitle: "Real results from real users who transformed their conversations",
        stats: [
          { number: "10K+", label: "Active Users", icon: "👥" },
          { number: "50K+", label: "Suggestions Generated", icon: "💬" },
          { number: "4.9/5", label: "Average Rating", icon: "⭐" },
          { number: "3 sec", label: "Average Response Time", icon: "⚡" },
        ],
        testimonials: [
          { 
            text: "RizzUp completely changed my game. I used to overthink every message for hours. Now I get perfect suggestions in seconds. Literally a game-changer.", 
            author: "Alex, 23", 
            role: "College Student",
            rating: 5 
          },
          { 
            text: "I was so bad at keeping conversations going. RizzUp's AI always knows exactly what to say. My confidence has skyrocketed!", 
            author: "Sarah, 21", 
            role: "Marketing Intern",
            rating: 5 
          },
          { 
            text: "The conversation starter feature is insane. I never run out of things to talk about anymore. Best $0 I've ever spent.", 
            author: "Mike, 25", 
            role: "Software Engineer",
            rating: 5 
          },
        ]
      },
      
      faq: {
        title: "Questions? We've Got Answers",
        items: [
          {
            question: "Is RizzUp really free?",
            answer: "Yes! RizzUp is 100% free to start. Get unlimited reply suggestions, conversation starters, and feedback without paying a cent. We may introduce premium features later, but the core functionality will always be free."
          },
          {
            question: "How does the AI work?",
            answer: "Our AI analyzes your screenshot or description, understands the context, tone, and conversation history, then generates 3-5 personalized reply suggestions that match the vibe. It learns from millions of successful conversations to give you the best options."
          },
          {
            question: "Is my data private and secure?",
            answer: "Absolutely. We take privacy seriously. Your conversations are encrypted and never shared with third parties. We only use the data to improve suggestions for you. You can delete your data anytime."
          },
          {
            question: "Can I use RizzUp for Instagram, WhatsApp, or any app?",
            answer: "Yes! RizzUp works with any messaging platform. Just upload a screenshot from Instagram, WhatsApp, Snapchat, Tinder, or any other app, and we'll generate suggestions that fit perfectly."
          },
          {
            question: "Will people know I'm using AI?",
            answer: "Nope! Our suggestions sound natural and authentic. They're designed to match your personality and style, so nobody will ever know you had a little help. It's like having a conversation coach in your pocket."
          }
        ]
      },
      
      finalCTA: {
        title: "Ready to Never Worry About What to Say Again?",
        subtitle: "Join 10,000+ users who are already having better conversations. Start free in under 30 seconds.",
        button: "Start Free Now",
        subtext: "No credit card required • Free forever • Takes 30 seconds"
      },
      
      footer: {
        tagline: "Level up your conversations with AI",
        links: ["About", "Features", "Pricing", "Blog"],
        legal: ["Privacy Policy", "Terms of Service", "Contact"],
        copyright: "© 2024 RizzUp. All rights reserved."
      }
    },
    
    indonesia: {
      logo: "RizzUp",
      badge: "🔥 10.000+ Pengguna Sudah Menang",
      heroTitle: "Tidak Akan Pernah Kehabisan Kata Lagi",
      heroSubtitle: "Coach percakapan bertenaga AI yang mengubah keheningan canggung jadi koneksi yang percaya diri. Dapatkan saran balasan instan, pembuka percakapan, dan feedback ahli—semua dalam 3 detik.",
      ctaPrimary: "Mulai Gratis Sekarang",
      trustText: "Gabung 10K+ pengguna",
      floatingCard1: "Balasan sempurna 3 detik",
      floatingCard2: "AI analisa konteks",
      floatingCard3: "Level up instan",
      
      problem: {
        title: "Bosan Dengan Pembunuh Percakapan Ini?",
        points: [
          "Menatap layar 10 menit, bingung mau balas apa",
          "Overthinking setiap pesan sampai terlambat",
          "Percakapan mati karena kehabisan topik",
          "Malu sama pesan sendiri esok harinya"
        ]
      },
      
      solution: {
        title: "Ini Yang Berubah Dengan RizzUp",
        points: [
          "Dapat 3-5 opsi balasan sempurna dalam 3 detik",
          "AI baca tone, konteks & kepribadian otomatis",
          "Tidak pernah kehabisan topik percakapan lagi",
          "Kirim setiap pesan dengan percaya diri"
        ]
      },
      
      howItWorks: {
        title: "Sangat Mudah, Kamu Akan Heran Kenapa Tidak Mulai Lebih Awal",
        steps: [
          { 
            number: "1", 
            title: "Upload & Bagikan", 
            description: "Taruh screenshot, Instagram story, atau jelaskan situasimu. Cuma 5 detik.",
            icon: "📤"
          },
          { 
            number: "2", 
            title: "AI Bekerja", 
            description: "AI kami analisa tone, konteks, kepribadian, dan riwayat percakapan untuk buat respons sempurna.",
            icon: "🤖"
          },
          { 
            number: "3", 
            title: "Pilih & Kirim", 
            description: "Pilih dari 3-5 saran yang disesuaikan atau gabungkan. Kirim dengan percaya diri.",
            icon: "✨"
          },
        ]
      },
      
      features: [
        {
          icon: "⚡",
          title: "Saran Balasan Instan",
          description: "Upload screenshot atau story apapun. Dapat 3-5 opsi balasan dalam 3 detik. Tidak ada lagi kecemasan layar kosong.",
          benefit: "Hemat 10+ menit per chat"
        },
        {
          icon: "🎯",
          title: "AI Paham Konteks",
          description: "AI kami baca di antara baris—memahami tone, emosi, dan riwayat untuk kasih saran yang tepat setiap kali.",
          benefit: "95% tingkat akurasi"
        },
        {
          icon: "💡",
          title: "Pembuka Percakapan",
          description: "Mau pecahkan es atau hidupkan chat yang mati? Dapat pembuka kreatif untuk situasi apapun. Tidak canggung lagi.",
          benefit: "Ice breaker dijamin"
        },
        {
          icon: "📈",
          title: "Feedback AI Jujur",
          description: "Upload screenshot chat dan dapat rating dengan tips actionable. Lacak peningkatanmu dan lihat dirimu level up.",
          benefit: "Pertumbuhan berbasis data"
        },
      ],
      
      social: {
        title: "Dipercaya 10.000+ Orang Seperti Kamu",
        subtitle: "Hasil nyata dari pengguna nyata yang transformasi percakapan mereka",
        stats: [
          { number: "10K+", label: "Pengguna Aktif", icon: "👥" },
          { number: "50K+", label: "Saran Dihasilkan", icon: "💬" },
          { number: "4.9/5", label: "Rating Rata-rata", icon: "⭐" },
          { number: "3 dtk", label: "Waktu Respons Rata-rata", icon: "⚡" },
        ],
        testimonials: [
          { 
            text: "RizzUp benar-benar ubah game saya. Dulu overthinking setiap pesan berjam-jam. Sekarang dapat saran sempurna dalam hitungan detik. Literally game-changer.", 
            author: "Alex, 23", 
            role: "Mahasiswa",
            rating: 5 
          },
          { 
            text: "Aku dulu sangat buruk menjaga percakapan tetap berjalan. AI RizzUp selalu tahu persis apa yang harus dikatakan. Kepercayaan diriku melonjak!", 
            author: "Sarah, 21", 
            role: "Marketing Intern",
            rating: 5 
          },
          { 
            text: "Fitur pembuka percakapan gila. Aku tidak pernah kehabisan topik lagi. Best $0 yang pernah aku habiskan.", 
            author: "Mike, 25", 
            role: "Software Engineer",
            rating: 5 
          },
        ]
      },
      
      faq: {
        title: "Punya Pertanyaan? Kami Punya Jawaban",
        items: [
          {
            question: "Apakah RizzUp benar-benar gratis?",
            answer: "Ya! RizzUp 100% gratis untuk memulai. Dapat saran balasan unlimited, pembuka percakapan, dan feedback tanpa bayar sepeser pun. Kami mungkin perkenalkan fitur premium nanti, tapi fungsi inti akan selalu gratis."
          },
          {
            question: "Bagaimana AI-nya bekerja?",
            answer: "AI kami analisa screenshot atau deskripsimu, pahami konteks, tone, dan riwayat percakapan, lalu hasilkan 3-5 saran balasan personal yang cocok vibenya. Belajar dari jutaan percakapan sukses untuk kasih opsi terbaik."
          },
          {
            question: "Apakah data saya privat dan aman?",
            answer: "Tentu. Kami serius soal privasi. Percakapanmu dienkripsi dan tidak pernah dibagikan ke pihak ketiga. Kami hanya pakai data untuk tingkatkan saran untukmu. Kamu bisa hapus datamu kapan saja."
          },
          {
            question: "Bisa pakai RizzUp untuk Instagram, WhatsApp, atau app lain?",
            answer: "Ya! RizzUp kerja dengan platform messaging apapun. Tinggal upload screenshot dari Instagram, WhatsApp, Snapchat, Tinder, atau app lain, dan kami akan hasilkan saran yang cocok sempurna."
          },
          {
            question: "Apakah orang akan tahu aku pakai AI?",
            answer: "Tidak! Saran kami terdengar natural dan autentik. Dirancang cocok dengan kepribadian dan gayamu, jadi tidak ada yang akan tahu kamu dapat bantuan. Seperti punya coach percakapan di kantongmu."
          }
        ]
      },
      
      finalCTA: {
        title: "Siap Untuk Tidak Khawatir Lagi Tentang Apa Yang Harus Dikatakan?",
        subtitle: "Gabung 10.000+ pengguna yang sudah punya percakapan lebih baik. Mulai gratis dalam 30 detik.",
        button: "Mulai Gratis Sekarang",
        subtext: "Tidak perlu kartu kredit • Gratis selamanya • Cuma 30 detik"
      },
      
      footer: {
        tagline: "Tingkatkan percakapanmu dengan AI",
        links: ["Tentang", "Fitur", "Harga", "Blog"],
        legal: ["Kebijakan Privasi", "Syarat Layanan", "Kontak"],
        copyright: "© 2024 RizzUp. Hak cipta dilindungi."
      }
    }
  };

  const t = translations[language];

  const handleGetStarted = () => router.push('/app/welcome-page');

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const toggleFAQ = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div style={styles.landing}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.navLogo}>{t.logo}</div>
          <div style={styles.navLinks}>
            <div style={styles.languageSwitch}>
              <button 
                style={{...styles.langBtn, ...(language === 'english' ? styles.langBtnActive : {})}} 
                onClick={() => handleLanguageChange('english')}
              >
                EN
              </button>
              <button 
                style={{...styles.langBtn, ...(language === 'indonesia' ? styles.langBtnActive : {})}} 
                onClick={() => handleLanguageChange('indonesia')}
              >
                ID
              </button>
            </div>
            <button style={styles.navBtn} onClick={handleGetStarted}>{t.ctaPrimary}</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <div style={styles.badge}>{t.badge}</div>
            <h1 style={styles.heroTitle}>{t.heroTitle}</h1>
            <p style={styles.heroSubtitle}>{t.heroSubtitle}</p>
            <div style={styles.ctaGroup}>
              <button style={styles.btnPrimary} onClick={handleGetStarted}>
                <Sparkles size={20} />
                <span>{t.ctaPrimary}</span>
              </button>
              <div style={styles.trustIndicator}>
                <div style={styles.avatarGroup}>
                  <div style={{...styles.avatar, left: 0}}>👤</div>
                  <div style={{...styles.avatar, left: '24px'}}>👤</div>
                  <div style={{...styles.avatar, left: '48px'}}>👤</div>
                </div>
                <span style={styles.trustText}>{t.trustText}</span>
              </div>
            </div>
          </div>
          
          <div style={styles.phoneMockupContainer}>
            {/* Phone 1 - Reply Suggestions */}
            <div style={{...styles.phoneFrame, animationDelay: '0s'}}>
              <div style={styles.phoneNotch}></div>
              <div style={styles.phoneScreen}>
                <div style={styles.mockupHeader}>
                  <div style={styles.mockupHeaderText}>
                    <div style={styles.mockupTitle}>💬 Reply Suggestions</div>
                    <div style={styles.mockupSubtitle}>AI Analysis</div>
                  </div>
                </div>
                <div style={styles.mockupContent}>
                  <div style={styles.incomingMessage}>
                    <div style={styles.messageText}>Hey! What are you up to this weekend? 😊</div>
                  </div>
                  <div style={styles.aiSuggestions}>
                    <div style={styles.suggestionBadge}>✨ AI Suggestions</div>
                    <div style={styles.suggestionCard}>
                      <div style={styles.suggestionEmoji}>😎</div>
                      <div style={styles.suggestionText}>Not much! Want to grab coffee and catch up?</div>
                    </div>
                    <div style={styles.suggestionCard}>
                      <div style={styles.suggestionEmoji}>🎮</div>
                      <div style={styles.suggestionText}>Planning a chill gaming session. You should join!</div>
                    </div>
                    <div style={styles.suggestionCard}>
                      <div style={styles.suggestionEmoji}>🎬</div>
                      <div style={styles.suggestionText}>Movie marathon! Got any recommendations?</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 2 - Rating */}
            <div style={{...styles.phoneFrame, ...styles.phoneFrameCenter, animationDelay: '0.3s'}}>
              <div style={styles.phoneNotch}></div>
              <div style={styles.phoneScreen}>
                <div style={styles.mockupHeader}>
                  <div style={styles.mockupHeaderText}>
                    <div style={styles.mockupTitle}>📊 Conversation Rating</div>
                    <div style={styles.mockupSubtitle}>AI Feedback</div>
                  </div>
                </div>
                <div style={styles.mockupContent}>
                  <div style={styles.ratingDisplay}>
                    <div style={styles.scoreCircle}>
                      <div style={styles.scoreNumber}>8.5</div>
                      <div style={styles.scoreMax}>/10</div>
                    </div>
                    <div style={styles.ratingLabel}>Great Flow!</div>
                  </div>
                  <div style={styles.feedbackSection}>
                    <div style={styles.feedbackItem}>
                      <Check size={18} color="#22c55e" />
                      <span>Good tone match</span>
                    </div>
                    <div style={styles.feedbackItem}>
                      <Check size={18} color="#22c55e" />
                      <span>Natural conversation</span>
                    </div>
                    <div style={styles.feedbackItem}>
                      <MessageCircle size={18} color="#fbbf24" />
                      <span>Try more open questions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 3 - Conversation Starter */}
            <div style={{...styles.phoneFrame, animationDelay: '0.6s'}}>
              <div style={styles.phoneNotch}></div>
              <div style={styles.phoneScreen}>
                <div style={styles.mockupHeader}>
                  <div style={styles.mockupHeaderText}>
                    <div style={styles.mockupTitle}>🚀 Conversation Starter</div>
                    <div style={styles.mockupSubtitle}>Break the Ice</div>
                  </div>
                </div>
                <div style={styles.mockupContent}>
                  <div style={styles.starterCard}>
                    <div style={styles.starterIcon}>💡</div>
                    <div style={styles.starterText}>I just saw the funniest thing today... you won't believe it 😂</div>
                    <div style={styles.starterMeta}>
                      <span style={styles.starterTag}>Casual</span>
                      <span style={styles.starterTag}>Engaging</span>
                    </div>
                  </div>
                  <div style={styles.starterCard}>
                    <div style={styles.starterIcon}>🎯</div>
                    <div style={styles.starterText}>Random question: if you could learn any skill instantly, what would it be?</div>
                    <div style={styles.starterMeta}>
                      <span style={styles.starterTag}>Deep</span>
                      <span style={styles.starterTag}>Fun</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <div style={styles.heroVisual}>
            <div style={{...styles.floatingCard, animationDelay: '0s', top: '50%', left: '75%'}}>
              <div style={styles.cardIcon}>💬</div>
              <div style={styles.cardText}>{t.floatingCard1}</div>
            </div>
            <div style={{...styles.floatingCard, animationDelay: '0.7s', top: '3%', right: '55%'}}>
              <div style={styles.cardIcon}>✨</div>
              <div style={styles.cardText}>{t.floatingCard2}</div>
            </div>
            <div style={{...styles.floatingCard, animationDelay: '1.4s', bottom: '0%', left: '55%'}}>
              <div style={styles.cardIcon}>🚀</div>
              <div style={styles.cardText}>{t.floatingCard3}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section style={styles.problemSection}>
        <div style={styles.container}>
          <div style={styles.problemGrid}>
            <div style={styles.problemBox}>
              <h2 style={styles.sectionTitle}>{t.problem.title}</h2>
              <ul style={styles.pointsList}>
                {t.problem.points.map((point, idx) => (
                  <li key={idx} style={styles.pointItem}>
                    <X size={20} color="#ef4444" style={styles.pointIcon} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div style={styles.arrow}>→</div>
            
            <div style={styles.solutionBox}>
              <h2 style={styles.sectionTitle}>{t.solution.title}</h2>
              <ul style={styles.pointsList}>
                {t.solution.points.map((point, idx) => (
                  <li key={idx} style={styles.pointItem}>
                    <Check size={20} color="#22c55e" style={styles.pointIcon} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howItWorksSection}>
        <div style={styles.container}>
          <h2 style={styles.mainTitle}>{t.howItWorks.title}</h2>
          <div style={styles.stepsGrid}>
            {t.howItWorks.steps.map((step, idx) => (
              <div key={idx} style={styles.stepCard}>
                <div style={styles.stepIcon}>{step.icon}</div>
                <div style={styles.stepNumber}>{step.number}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.container}>
          <h2 style={styles.mainTitle}>Everything You Need to Master Conversations</h2>
          <p style={styles.mainSubtitle}>Powerful AI features that actually work</p>
          
          <div style={styles.featuresGrid}>
            {t.features.map((feature, idx) => (
              <div key={idx} style={styles.featureCard}>
                <div style={styles.featureIconWrapper}>
                  <span style={styles.featureIcon}>{feature.icon}</span>
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.description}</p>
                <div style={styles.featureBenefit}>
                  <Zap size={16} color="#22c55e" />
                  <span>{feature.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section style={styles.socialSection}>
        <div style={styles.container}>
          <h2 style={styles.mainTitle}>{t.social.title}</h2>
          <p style={styles.mainSubtitle}>{t.social.subtitle}</p>
          
          {/* Stats */}
          <div style={styles.statsGrid}>
            {t.social.stats.map((stat, idx) => (
              <div key={idx} style={styles.statCard}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Testimonials */}
          <div style={styles.testimonialsGrid}>
            {t.social.testimonials.map((testi, idx) => (
              <div key={idx} style={styles.testimonialCard}>
                <div style={styles.testimonialStars}>
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p style={styles.testimonialText}>"{testi.text}"</p>
                <div style={styles.testimonialAuthor}>
                  <strong>{testi.author}</strong>
                  <span> • {testi.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.faqSection}>
        <div style={styles.container}>
          <h2 style={styles.mainTitle}>{t.faq.title}</h2>
          
          <div style={styles.faqList}>
            {t.faq.items.map((item, idx) => (
              <div key={idx} style={styles.faqItem}>
                <button 
                  style={styles.faqQuestion} 
                  onClick={() => toggleFAQ(idx)}
                >
                  <span>{item.question}</span>
                  <ChevronDown 
                    size={24} 
                    style={{
                      ...styles.faqIcon,
                      transform: faqOpen === idx ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </button>
                {faqOpen === idx && (
                  <div style={styles.faqAnswer}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCTA}>
        <div style={styles.container}>
          <h2 style={styles.ctaTitle}>{t.finalCTA.title}</h2>
          <p style={styles.ctaSubtitle}>{t.finalCTA.subtitle}</p>
          <button style={styles.btnPrimaryCTA} onClick={handleGetStarted}>
            <Zap size={24} />
            <span>{t.finalCTA.button}</span>
          </button>
          <p style={styles.ctaSubtext}>{t.finalCTA.subtext}</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerBrand}>
            <h3 style={styles.footerLogo}>{t.logo}</h3>
            <p style={styles.footerTagline}>{t.footer.tagline}</p>
          </div>
          
          <div style={styles.footerLinks}>
            {t.footer.links.map((link, idx) => (
              <a key={idx} href="#" style={styles.footerLink}>{link}</a>
            ))}
          </div>
          
          <div style={styles.footerLinks}>
            {t.footer.legal.map((link, idx) => (
              <a key={idx} href="#" style={styles.footerLink}>{link}</a>
            ))}
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  landing: {
    background: '#0a0a0a',
    color: '#ffffff',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  // Navigation
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(10, 10, 10, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLogo: {
    fontSize: '28px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  languageSwitch: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '4px',
    borderRadius: '20px',
  },
  langBtn: {
    padding: '8px 16px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  langBtnActive: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
  },
  navBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  // Hero Section
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 40px 80px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    overflow: 'hidden',
  },
  heroContainer: {
    maxWidth: '1400px',
    width: '100%',
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: '600px',
    textAlign: 'left',
  },
  badge: {
    display: 'inline-block',
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '30px',
    animation: 'fadeInDown 0.8s ease',
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: '24px',
    animation: 'fadeInUp 0.8s ease 0.2s both',
  },
  heroSubtitle: {
    fontSize: '20px',
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '40px',
    animation: 'fadeInUp 0.8s ease 0.4s both',
  },
  ctaGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    animation: 'fadeInUp 0.8s ease 0.6s both',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '18px 40px',
    fontSize: '18px',
    fontWeight: 700,
    background: 'white',
    color: '#764ba2',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  trustIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarGroup: {
    position: 'relative',
    width: '84px',
    height: '36px',
  },
  avatar: {
    position: 'absolute',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  trustText: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroVisual: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 200,
    pointerEvents: 'none',
  },
  floatingCard: {
    position: 'absolute',
    padding: '16px 24px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'float 3s ease-in-out infinite',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  cardIcon: {
    fontSize: '24px',
  },
  cardText: {
    fontSize: '14px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  
  // Phone Mockups
  phoneMockupContainer: {
    position: 'relative',
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    perspective: '1000px',
  },
  phoneFrame: {
    width: '280px',
    height: '580px',
    background: '#1a1a1a',
    borderRadius: '40px',
    padding: '12px',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
    animation: 'floatPhone 4s ease-in-out infinite',
    position: 'relative',
    transform: 'scale(0.9)',
    opacity: 0.8,
    transition: 'all 0.3s ease',
  },
  phoneFrameCenter: {
    transform: 'scale(1)',
    opacity: 1,
    zIndex: 2,
  },
  phoneNotch: {
    position: 'absolute',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: '28px',
    background: '#0a0a0a',
    borderRadius: '0 0 20px 20px',
    zIndex: 10,
  },
  phoneScreen: {
    width: '100%',
    height: '100%',
    background: '#ffffff',
    borderRadius: '32px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  mockupHeader: {
    padding: '40px 20px 20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
  },
  mockupHeaderText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  mockupTitle: {
    fontWeight: 700,
    fontSize: '16px',
  },
  mockupSubtitle: {
    fontSize: '12px',
    opacity: 0.9,
  },
  mockupContent: {
    flex: 1,
    padding: '20px',
    background: '#f8f9fa',
    overflow: 'auto',
  },
  
  // Message Styles
  incomingMessage: {
    marginBottom: '20px',
  },
  messageText: {
    background: '#e5e7eb',
    color: '#1f2937',
    padding: '12px 16px',
    borderRadius: '18px',
    borderTopLeftRadius: '4px',
    fontSize: '13px',
    lineHeight: 1.4,
    maxWidth: '85%',
  },
  aiSuggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  suggestionBadge: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  suggestionCard: {
    background: 'white',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  suggestionEmoji: {
    fontSize: '20px',
    flexShrink: 0,
  },
  suggestionText: {
    fontSize: '12px',
    color: '#374151',
    lineHeight: 1.4,
  },
  
  // Rating Display
  ratingDisplay: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  scoreCircle: {
    width: '140px',
    height: '140px',
    margin: '0 auto 16px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
  },
  scoreNumber: {
    fontSize: '48px',
    fontWeight: 900,
    color: 'white',
    lineHeight: 1,
  },
  scoreMax: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
  },
  ratingLabel: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#22c55e',
  },
  feedbackSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  feedbackItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    background: 'white',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#374151',
    fontWeight: 500,
    border: '1px solid #e5e7eb',
  },
  
  // Conversation Starters
  starterCard: {
    background: 'white',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  starterIcon: {
    fontSize: '28px',
    marginBottom: '10px',
  },
  starterText: {
    fontSize: '13px',
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: '12px',
  },
  starterMeta: {
    display: 'flex',
    gap: '8px',
  },
  starterTag: {
    fontSize: '10px',
    fontWeight: 600,
    padding: '4px 10px',
    background: '#f3f4f6',
    color: '#667eea',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  
  // Problem/Solution Section
  problemSection: {
    padding: '100px 40px',
    background: '#0f0f0f',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  problemGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '40px',
    alignItems: 'center',
  },
  problemBox: {
    padding: '40px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '24px',
    animation: 'slideInLeft 0.8s ease',
  },
  solutionBox: {
    padding: '40px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '2px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '24px',
    animation: 'slideInRight 0.8s ease',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 800,
    marginBottom: '24px',
  },
  pointsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  pointItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '16px',
    lineHeight: 1.6,
  },
  pointIcon: {
    flexShrink: 0,
    marginTop: '2px',
  },
  arrow: {
    fontSize: '48px',
    fontWeight: 900,
    color: '#667eea',
    textAlign: 'center',
  },
  
  // How It Works Section
  howItWorksSection: {
    padding: '100px 40px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
  },
  mainTitle: {
    fontSize: '48px',
    fontWeight: 900,
    textAlign: 'center',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  mainSubtitle: {
    fontSize: '20px',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '60px',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    marginTop: '60px',
  },
  stepCard: {
    position: 'relative',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  stepIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  stepNumber: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 900,
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '12px',
  },
  stepDesc: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.6,
  },
  
  // Features Section
  featuresSection: {
    padding: '100px 40px',
    background: '#0a0a0a',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    marginTop: '60px',
  },
  featureCard: {
    padding: '40px 30px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
  },
  featureIconWrapper: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  featureIcon: {
    fontSize: '32px',
  },
  featureTitle: {
    fontSize: '22px',
    fontWeight: 700,
    marginBottom: '12px',
  },
  featureDesc: {
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  featureBenefit: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#22c55e',
    width: 'fit-content',
  },
  
  // Social Proof Section
  socialSection: {
    padding: '100px 40px',
    background: '#0f0f0f',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '30px',
    marginBottom: '80px',
  },
  statCard: {
    padding: '40px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 600,
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  testimonialCard: {
    padding: '32px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  testimonialStars: {
    display: 'flex',
    gap: '4px',
    marginBottom: '16px',
  },
  testimonialText: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  
  // FAQ Section
  faqSection: {
    padding: '100px 40px',
    background: '#0a0a0a',
  },
  faqList: {
    maxWidth: '800px',
    margin: '60px auto 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  faqItem: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  faqQuestion: {
    width: '100%',
    padding: '24px 28px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    fontWeight: 600,
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  faqIcon: {
    transition: 'transform 0.3s ease',
    flexShrink: 0,
  },
  faqAnswer: {
    padding: '0 28px 24px 28px',
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.7)',
    animation: 'fadeIn 0.3s ease',
  },
  
  // Final CTA
  finalCTA: {
    padding: '100px 40px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '48px',
    fontWeight: 900,
    marginBottom: '16px',
    lineHeight: 1.2,
  },
  ctaSubtitle: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '40px',
  },
  btnPrimaryCTA: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 48px',
    fontSize: '20px',
    fontWeight: 700,
    background: 'white',
    color: '#764ba2',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    marginBottom: '20px',
  },
  ctaSubtext: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 500,
  },
  
  // Footer
  footer: {
    padding: '60px 40px 30px',
    background: '#0a0a0a',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  footerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerLogo: {
    fontSize: '24px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  footerTagline: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerLink: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    paddingTop: '30px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
  },
};