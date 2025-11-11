// app/api/rate-rizz/route.js
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { imageData, mimeType, language = 'english' } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Language-specific prompts
    const prompts = {
      english: `You are a brutally honest, no-nonsense dating coach analyzing a chat conversation screenshot. Your job is to tell the TRUTH, even if it hurts. Be critical, direct, and constructive.

Carefully analyze the conversation in this image and evaluate the person's "rizz" (charm, conversation skills, flirting ability) based on:
1. Conversation flow and engagement (Are they boring? Too eager? Desperate?)
2. Use of humor and wit (Cringe? Funny? Non-existent?)
3. Show of genuine interest (Too much? Too little? Fake?)
4. Confidence level (Desperate? Arrogant? Balanced?)
5. Timing and response quality (Too fast? Too slow? Low effort?)
6. Emotional intelligence (Tone deaf? Socially aware?)
7. Playfulness and banter (Awkward? Smooth? Missing entirely?)
8. Ability to create attraction (Friend-zoned? Creating tension? Killing attraction?)

BE HONEST AND CRITICAL:
- If they're being cringe, say it
- If they're being desperate, call it out
- If they're boring, tell them
- If they're too try-hard, be direct
- If they're doing well, acknowledge it but still give improvement areas
- Don't sugarcoat - this is tough love coaching

Rate the conversation on a scale of 0-100:
- 0-20: Poor (This is painful to read, major red flags)
- 21-40: Below Average (Significant issues, needs serious work)
- 41-60: Average (Mediocre, not standing out, room for improvement)
- 61-75: Good (Solid performance, but not exceptional)
- 76-89: Excellent (Strong game, minor tweaks needed)
- 90-100: Outstanding (Masterclass level, very rare)

IMPORTANT: 
- Be REALISTIC with scores. Most conversations should be 40-70 range
- Don't give 80+ unless truly exceptional
- Don't be afraid to give low scores (20-40) if the conversation is genuinely bad
- Focus on what's WRONG and needs FIXING, not just what's right
- Use direct, slightly harsh language when needed

Provide 3-4 specific feedback items. Mix of:
- What they're doing WRONG (be specific and critical)
- What needs IMMEDIATE improvement
- What they should STOP doing
- If anything is actually good, acknowledge it briefly

Respond in English.

Return ONLY a valid JSON object with no markdown, no code blocks. Format:
{
  "rizzScore": 45,
  "scoreLabel": "Average",
  "scoreMessage": "Your conversation is mediocre. You're not standing out and making several common mistakes.",
  "feedbackItems": [
    {
      "icon": "❌",
      "iconBg": "#FFEBEE",
      "iconColor": "#F44336",
      "title": "Too desperate and eager",
      "description": "You're responding too fast and asking too many questions. This screams desperation. Slow down and match their energy."
    },
    {
      "icon": "⚠️",
      "iconBg": "#FFF3E0",
      "iconColor": "#FF9800",
      "title": "No playful banter",
      "description": "Your conversation is like a job interview. Add teasing, jokes, and personality. You're putting them on a pedestal."
    },
    {
      "icon": "💡",
      "iconBg": "#E3F2FD",
      "iconColor": "#2196F3",
      "title": "Create some mystery",
      "description": "Stop over-sharing and being an open book. Leave some things for them to discover. Less is more."
    }
  ]
}

Icon guide for feedback tone:
- Critical/Wrong: "❌" with red (#FFEBEE, #F44336)
- Warning/Needs Work: "⚠️" with orange (#FFF3E0, #FF9800)
- Improvement Needed: "💡" with blue (#E3F2FD, #2196F3)
- Stop Doing: "🛑" with deep red (#FCE4EC, #E91E63)
- Awkward/Cringe: "😬" with yellow (#FFFDE7, #FBC02D)
- If something is actually good: "✓" with green (#E8F5E9, #4CAF50)
- Timing issues: "⏰" with teal (#E0F2F1, #009688)
- Personality issues: "💜" with purple (#F3E5F5, #9C27B0)

Be tough but fair. The goal is to genuinely help them improve by pointing out harsh truths.`,

      indonesia: `Kamu adalah pelatih kencan yang sangat jujur dan tegas yang sedang menganalisis screenshot percakapan chat. Tugasmu adalah mengatakan KEBENARAN, meskipun menyakitkan. Bersikaplah kritis, langsung, dan konstruktif.

Analisis dengan cermat percakapan dalam gambar ini dan evaluasi "rizz" orang tersebut (pesona, kemampuan percakapan, kemampuan merayu) berdasarkan:
1. Alur percakapan dan keterlibatan (Apakah mereka membosankan? Terlalu eager? Desperate?)
2. Penggunaan humor dan kecerdasan (Cringe? Lucu? Tidak ada?)
3. Menunjukkan ketertarikan yang tulus (Terlalu banyak? Terlalu sedikit? Palsu?)
4. Level kepercayaan diri (Desperate? Arogan? Seimbang?)
5. Timing dan kualitas respons (Terlalu cepat? Terlalu lambat? Asal-asalan?)
6. Kecerdasan emosional (Tidak peka? Sadar sosial?)
7. Playfulness dan banter (Canggung? Smooth? Tidak ada sama sekali?)
8. Kemampuan menciptakan ketertarikan (Di-friendzone? Menciptakan ketegangan? Membunuh ketertarikan?)

BERSIKAPLAH JUJUR DAN KRITIS:
- Kalau mereka cringe, katakan
- Kalau mereka desperate, tegur
- Kalau mereka membosankan, beritahu
- Kalau mereka terlalu try-hard, langsung saja
- Kalau mereka bagus, akui tapi tetap beri area untuk perbaikan
- Jangan mempermanis - ini tough love coaching

Beri nilai percakapan dalam skala 0-100:
- 0-20: Buruk (Ini menyakitkan untuk dibaca, red flags besar)
- 21-40: Di Bawah Rata-rata (Masalah signifikan, perlu kerja keras)
- 41-60: Rata-rata (Biasa saja, tidak menonjol, perlu perbaikan)
- 61-75: Bagus (Performa solid, tapi tidak exceptional)
- 76-89: Sangat Bagus (Game kuat, perlu penyesuaian kecil)
- 90-100: Luar Biasa (Level masterclass, sangat jarang)

PENTING:
- Bersikap REALISTIS dengan skor. Kebanyakan percakapan harusnya 40-70
- Jangan beri 80+ kecuali benar-benar exceptional
- Jangan takut beri skor rendah (20-40) kalau percakapannya memang jelek
- Fokus pada apa yang SALAH dan perlu DIPERBAIKI, bukan hanya apa yang benar
- Gunakan bahasa yang langsung dan sedikit keras kalau perlu

Berikan 3-4 feedback item spesifik. Campuran dari:
- Apa yang mereka lakukan SALAH (spesifik dan kritis)
- Apa yang perlu perbaikan SEGERA
- Apa yang harus DIHENTIKAN
- Kalau ada yang bagus, akui secara singkat

Respond dalam Bahasa Indonesia.

Return HANYA objek JSON yang valid tanpa markdown, tanpa code blocks. Format:
{
  "rizzScore": 45,
  "scoreLabel": "Rata-rata",
  "scoreMessage": "Percakapanmu biasa saja. Kamu tidak menonjol dan membuat beberapa kesalahan umum.",
  "feedbackItems": [
    {
      "icon": "❌",
      "iconBg": "#FFEBEE",
      "iconColor": "#F44336",
      "title": "Terlalu desperate dan eager",
      "description": "Kamu balas terlalu cepat dan tanya terlalu banyak pertanyaan. Ini kelihatan desperate. Pelan-pelan dan samakan energi mereka."
    },
    {
      "icon": "⚠️",
      "iconBg": "#FFF3E0",
      "iconColor": "#FF9800",
      "title": "Tidak ada playful banter",
      "description": "Percakapanmu seperti interview kerja. Tambahkan godaan, jokes, dan kepribadian. Kamu terlalu menempatkan mereka di atas."
    },
    {
      "icon": "💡",
      "iconBg": "#E3F2FD",
      "iconColor": "#2196F3",
      "title": "Ciptakan sedikit misteri",
      "description": "Berhenti over-sharing dan jadi buku terbuka. Biarkan ada hal untuk mereka temukan. Less is more."
    }
  ]
}

Panduan icon untuk tone feedback:
- Kritis/Salah: "❌" dengan merah (#FFEBEE, #F44336)
- Peringatan/Perlu Kerja: "⚠️" dengan orange (#FFF3E0, #FF9800)
- Perlu Perbaikan: "💡" dengan biru (#E3F2FD, #2196F3)
- Harus Berhenti: "🛑" dengan merah tua (#FCE4EC, #E91E63)
- Canggung/Cringe: "😬" dengan kuning (#FFFDE7, #FBC02D)
- Kalau ada yang bagus: "✓" dengan hijau (#E8F5E9, #4CAF50)
- Masalah timing: "⏰" dengan teal (#E0F2F1, #009688)
- Masalah kepribadian: "💜" dengan ungu (#F3E5F5, #9C27B0)

Bersikaplah keras tapi adil. Tujuannya adalah benar-benar membantu mereka dengan menunjukkan kebenaran yang keras.`
    };

    const fallbackResponses = {
      english: {
        rizzScore: 50,
        scoreLabel: "Average",
        scoreMessage: "Unable to fully analyze, but here's general feedback to improve your game.",
        feedbackItems: [
          {
            icon: "⚠️",
            iconBg: "#FFF3E0",
            iconColor: "#FF9800",
            title: "Work on your approach",
            description: "Review your conversation style and identify areas that feel forced or unnatural."
          },
          {
            icon: "💡",
            iconBg: "#E3F2FD",
            iconColor: "#2196F3",
            title: "Build genuine connection",
            description: "Focus on creating real rapport rather than following scripts or trying too hard."
          },
          {
            icon: "⏰",
            iconBg: "#E0F2F1",
            iconColor: "#009688",
            title: "Pay attention to timing",
            description: "Match their energy and response pace. Don't be too eager or too distant."
          }
        ]
      },
      indonesia: {
        rizzScore: 50,
        scoreLabel: "Rata-rata",
        scoreMessage: "Tidak bisa menganalisis sepenuhnya, tapi ini feedback umum untuk meningkatkan game kamu.",
        feedbackItems: [
          {
            icon: "⚠️",
            iconBg: "#FFF3E0",
            iconColor: "#FF9800",
            title: "Perbaiki pendekatanmu",
            description: "Review gaya percakapanmu dan identifikasi area yang terasa dipaksakan atau tidak natural."
          },
          {
            icon: "💡",
            iconBg: "#E3F2FD",
            iconColor: "#2196F3",
            title: "Bangun koneksi yang tulus",
            description: "Fokus pada menciptakan rapport yang nyata daripada mengikuti skrip atau terlalu berusaha keras."
          },
          {
            icon: "⏰",
            iconBg: "#E0F2F1",
            iconColor: "#009688",
            title: "Perhatikan timing",
            description: "Samakan energi dan pace respons mereka. Jangan terlalu eager atau terlalu jauh."
          }
        ]
      }
    };

    const contents = [
      {
        inlineData: {
          mimeType: mimeType,
          data: imageData,
        },
      },
      { 
        text: prompts[language]
      },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    console.log('Gemini AI Raw Response:', result.text);

    // Parse the JSON response
    let analysisResult;
    try {
      let cleanedResponse = result.text.trim();
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      analysisResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response text:', result.text);
      
      // Fallback based on language
      analysisResult = fallbackResponses[language];
    }

    return Response.json({ 
      success: true, 
      ...analysisResult,
      rawResponse: result.text
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}