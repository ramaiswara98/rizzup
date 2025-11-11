// app/api/generate-reply/route.js
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { imageData, mimeType, tone, language = 'english' } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Language-specific tone instructions
    const toneInstructions = {
      english: {
        friendly: "Act as a dating coach. Generate 3 friendly and warm reply suggestions that show genuine interest and create connection.",
        confident: "Act as a dating coach. Generate 3 confident and attractive reply suggestions that show self-assurance without being arrogant.",
        flirty: "Act as a dating coach. Generate 3 playful and flirty reply suggestions with charm, wit, and subtle romantic interest."
      },
      indonesia: {
        friendly: "Bertindaklah sebagai pelatih kencan. Hasilkan 3 saran balasan yang ramah dan hangat yang menunjukkan ketertarikan tulus dan menciptakan koneksi.",
        confident: "Bertindaklah sebagai pelatih kencan. Hasilkan 3 saran balasan yang percaya diri dan menarik yang menunjukkan keyakinan diri tanpa terlihat sombong.",
        flirty: "Bertindaklah sebagai pelatih kencan. Hasilkan 3 saran balasan yang playful dan menggoda dengan pesona, kecerdasan, dan ketertarikan romantis yang halus."
      }
    };

    // Language-specific prompts
    const prompts = {
      english: `${toneInstructions[language][tone]}

Analyze this Instagram story/post image carefully. Consider what the person is doing, their mood, the context, and any text in the image.

Generate exactly 3 reply suggestions. Each suggestion should:
- Be 1-2 sentences maximum
- Include relevant emojis
- Be contextually appropriate to what's shown in the image
- Match the ${tone} tone perfectly
- Sound natural and conversational

Respond in English.

IMPORTANT: Return ONLY a valid JSON array with no markdown, no code blocks, no additional text. Format:
[
  {
    "text": "Your reply suggestion here with emoji 🔥",
    "description": "Brief explanation of why this works"
  },
  {
    "text": "Second suggestion here 💯",
    "description": "Why this approach is effective"
  },
  {
    "text": "Third suggestion here ✨",
    "description": "What makes this reply engaging"
  }
]`,
      indonesia: `${toneInstructions[language][tone]}

Analisis gambar Instagram story/post ini dengan cermat. Pertimbangkan apa yang dilakukan orang tersebut, mood mereka, konteksnya, dan teks apa pun dalam gambar.

Hasilkan tepat 3 saran balasan. Setiap saran harus:
- Maksimal 1-2 kalimat
- Menyertakan emoji yang relevan
- Sesuai konteks dengan apa yang ditampilkan dalam gambar
- Cocok dengan nada ${tone} dengan sempurna
- Terdengar natural dan conversational

Respond dalam Bahasa Indonesia.

PENTING: Return HANYA array JSON yang valid tanpa markdown, tanpa code blocks, tanpa teks tambahan. Format:
[
  {
    "text": "Saran balasan kamu di sini dengan emoji 🔥",
    "description": "Penjelasan singkat mengapa ini efektif"
  },
  {
    "text": "Saran kedua di sini 💯",
    "description": "Mengapa pendekatan ini efektif"
  },
  {
    "text": "Saran ketiga di sini ✨",
    "description": "Apa yang membuat balasan ini engaging"
  }
]`
    };

    // Fallback suggestions based on language
    const fallbackSuggestions = {
      english: [
        {
          text: "That's awesome! Tell me more about that 🔥",
          description: "Shows genuine interest"
        },
        {
          text: "Looking great! What's the occasion? 💯",
          description: "Engaging and curious"
        },
        {
          text: "Love this vibe! How was it? ✨",
          description: "Positive and conversational"
        }
      ],
      indonesia: [
        {
          text: "Keren banget! Cerita dong lebih lanjut 🔥",
          description: "Menunjukkan ketertarikan yang tulus"
        },
        {
          text: "Kelihatan bagus! Ada acara apa nih? 💯",
          description: "Engaging dan penasaran"
        },
        {
          text: "Suka vibe-nya! Gimana tadi? ✨",
          description: "Positif dan conversational"
        }
      ]
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
    let suggestions;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = result.text.trim();
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      suggestions = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response text:', result.text);
      
      // Fallback suggestions based on language
      suggestions = fallbackSuggestions[language];
    }

    return Response.json({ 
      success: true, 
      suggestions: suggestions,
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