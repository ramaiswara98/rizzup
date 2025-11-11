// app/api/start-conversation/route.js
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { name, relation, topic, tone, language = 'english' } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Language-specific content
    const languageConfig = {
      english: {
        relationContext: {
          'Friend': 'a friend',
          'Partner': 'your romantic partner',
          'Colleague': 'a work colleague',
          'Family': 'a family member',
          'Crush': 'someone you have romantic interest in'
        },
        toneInstructions: {
          friendly: "warm, genuine, and approachable. Make them feel comfortable and valued.",
          confident: "confident and self-assured without being arrogant. Show you're interesting and have value.",
          flirty: "playful, charming, and subtly flirtatious. Create romantic tension while staying classy."
        },
        systemPrompt: "You are a dating and social skills coach.",
        responseLanguage: "Respond in English."
      },
      indonesia: {
        relationContext: {
          'Friend': 'teman',
          'Partner': 'pasangan romantis kamu',
          'Colleague': 'rekan kerja',
          'Family': 'anggota keluarga',
          'Crush': 'seseorang yang kamu sukai secara romantis'
        },
        toneInstructions: {
          friendly: "hangat, tulus, dan mudah didekati. Buat mereka merasa nyaman dan dihargai.",
          confident: "percaya diri dan yakin tanpa terlihat sombong. Tunjukkan bahwa kamu menarik dan punya nilai.",
          flirty: "playful, menawan, dan sedikit menggoda. Ciptakan ketegangan romantis sambil tetap berkelas."
        },
        systemPrompt: "Kamu adalah pelatih kencan dan keterampilan sosial.",
        responseLanguage: "Respond in Bahasa Indonesia (Indonesian language)."
      }
    };

    const config = languageConfig[language];
    const relationContext = config.relationContext;
    const toneInstructions = config.toneInstructions;

    let promptText;
    
    if (!topic) {
      // AI suggests a topic
      if (language === 'english') {
        promptText = `${config.systemPrompt}

The user wants to start a conversation with ${name}, who is ${relationContext[relation]}.

They haven't specified a topic, so YOU need to:
1. Suggest an appropriate conversation topic based on their relationship
2. Generate 3 conversation starters with a ${tone} tone

The conversation starters should be ${toneInstructions[tone]}

${config.responseLanguage}

IMPORTANT: Return ONLY a valid JSON object with no markdown, no code blocks. Format:
{
  "suggestedTopic": "A brief topic name (2-4 words)",
  "suggestions": [
    {
      "text": "Your conversation starter here with appropriate emoji",
      "description": "Why this opener works well"
    },
    {
      "text": "Second starter here",
      "description": "What makes this effective"
    },
    {
      "text": "Third starter here",
      "description": "The psychology behind this"
    }
  ]
}`;
      } else {
        promptText = `${config.systemPrompt}

User ingin memulai percakapan dengan ${name}, yang merupakan ${relationContext[relation]}.

Mereka belum menentukan topik, jadi KAMU harus:
1. Menyarankan topik percakapan yang sesuai berdasarkan hubungan mereka
2. Menghasilkan 3 pembuka percakapan dengan nada ${tone}

Pembuka percakapan harus ${toneInstructions[tone]}

${config.responseLanguage}

PENTING: Return HANYA objek JSON yang valid tanpa markdown, tanpa code blocks. Format:
{
  "suggestedTopic": "Nama topik singkat (2-4 kata)",
  "suggestions": [
    {
      "text": "Pembuka percakapan kamu di sini dengan emoji yang sesuai",
      "description": "Mengapa pembuka ini efektif"
    },
    {
      "text": "Pembuka kedua di sini",
      "description": "Apa yang membuat ini efektif"
    },
    {
      "text": "Pembuka ketiga di sini",
      "description": "Psikologi di balik ini"
    }
  ]
}`;
      }
    } else {
      // User specified a topic
      if (language === 'english') {
        promptText = `${config.systemPrompt}

The user wants to start a conversation with ${name}, who is ${relationContext[relation]}.
The topic they want to discuss is: "${topic}"
The tone should be: ${tone}

Generate 3 conversation starters that are ${toneInstructions[tone]}

Guidelines:
- Make it natural and contextually appropriate for their relationship
- Include the topic smoothly without being forced
- Each starter should be 1-2 sentences max
- Use emojis sparingly and appropriately
- Make them sound genuinely interested and engaging
- Avoid generic or boring openers

${config.responseLanguage}

IMPORTANT: Return ONLY a valid JSON object with no markdown, no code blocks. Format:
{
  "suggestions": [
    {
      "text": "Your conversation starter about ${topic} with emoji",
      "description": "Why this opener works for this relationship"
    },
    {
      "text": "Second starter addressing ${topic}",
      "description": "What makes this effective"
    },
    {
      "text": "Third creative starter about ${topic}",
      "description": "The psychology behind this approach"
    }
  ]
}`;
      } else {
        promptText = `${config.systemPrompt}

User ingin memulai percakapan dengan ${name}, yang merupakan ${relationContext[relation]}.
Topik yang ingin dibahas adalah: "${topic}"
Nada yang diinginkan: ${tone}

Hasilkan 3 pembuka percakapan yang ${toneInstructions[tone]}

Panduan:
- Buat natural dan sesuai konteks untuk hubungan mereka
- Sertakan topik dengan halus tanpa dipaksakan
- Setiap pembuka maksimal 1-2 kalimat
- Gunakan emoji dengan wajar dan sesuai
- Buat terdengar benar-benar tertarik dan engaging
- Hindari pembuka yang generik atau membosankan

${config.responseLanguage}

PENTING: Return HANYA objek JSON yang valid tanpa markdown, tanpa code blocks. Format:
{
  "suggestions": [
    {
      "text": "Pembuka percakapan kamu tentang ${topic} dengan emoji",
      "description": "Mengapa pembuka ini cocok untuk hubungan ini"
    },
    {
      "text": "Pembuka kedua tentang ${topic}",
      "description": "Apa yang membuat ini efektif"
    },
    {
      "text": "Pembuka ketiga yang kreatif tentang ${topic}",
      "description": "Psikologi di balik pendekatan ini"
    }
  ]
}`;
      }
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: promptText }],
    });

    console.log('Gemini AI Raw Response:', result.text);

    // Parse the JSON response
    let aiResult;
    try {
      let cleanedResponse = result.text.trim();
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      aiResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response text:', result.text);
      
      // Fallback suggestions based on language
      if (language === 'indonesia') {
        aiResult = {
          suggestedTopic: topic || "Rencana akhir pekan",
          suggestions: [
            {
              text: `Hai ${name}! Semoga kamu baik-baik aja. Apa kabar nih akhir-akhir ini? 😊`,
              description: "Santai dan ramah, menunjukkan ketertarikan yang tulus"
            },
            {
              text: `Halo ${name}! Tadi aku kepikiran kamu. Gimana kabarnya?`,
              description: "Personal dan hangat, membuat mereka merasa dihargai"
            },
            {
              text: `Apa kabar ${name}! Ada rencana seru nggak dalam waktu dekat? 🌟`,
              description: "Energi positif, membuka percakapan secara natural"
            }
          ]
        };
      } else {
        aiResult = {
          suggestedTopic: topic || "Weekend plans",
          suggestions: [
            {
              text: `Hey ${name}! Hope you're doing well. What have you been up to lately? 😊`,
              description: "Casual and friendly, shows genuine interest"
            },
            {
              text: `Hi ${name}! I was just thinking about you. How's everything going?`,
              description: "Personal and warm, makes them feel valued"
            },
            {
              text: `What's up ${name}! Got any exciting plans coming up? 🌟`,
              description: "Positive energy, opens up conversation naturally"
            }
          ]
        };
      }
    }

    return Response.json({ 
      success: true, 
      ...aiResult,
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