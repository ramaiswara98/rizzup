// app/api/generate-reply/route.js
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const {
      imageData,
      mimeType,
      tone,
      language = "english",
    } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Language-specific tone instructions
    const toneInstructions = {
      english: {
        friendly:
          "Act as a dating coach. Generate 3 friendly and warm reply suggestions that show genuine interest and create connection.",
        confident:
          "Act as a dating coach. Generate 3 confident and attractive reply suggestions that show self-assurance without being arrogant.",
        flirty:
          "Act as a dating coach. Generate 3 playful and flirty reply suggestions with charm, wit, and subtle romantic interest.",
      },
      indonesia: {
        friendly:
          "Bertindaklah sebagai pelatih kencan. Hasilkan 3 saran balasan yang ramah dan hangat yang menunjukkan ketertarikan tulus dan menciptakan koneksi.",
        confident:
          "Bertindaklah sebagai pelatih kencan. Hasilkan 3 saran balasan yang percaya diri dan menarik yang menunjukkan keyakinan diri tanpa terlihat sombong.",
        flirty:
          "Bertindaklah sebagai pelatih kencan. Hasilkan 3 saran balasan yang playful dan menggoda dengan pesona, kecerdasan, dan ketertarikan romantis yang halus.",
      },
    };

    // Language-specific prompts
    const prompts = {
      english: `${toneInstructions[language][tone]}

You're a top-tier dating coach who knows exactly how to charm, connect, and vibe naturally. Analyze this Instagram story/post image carefully: notice the person's mood, activity, environment, outfit, text in the image, and any personality cues. Match your reply to their vibe and personality. Imagine sending messages that would make them smile, laugh, or feel intrigued.

Generate exactly 3 reply suggestions. Each suggestion should:
- Be 1-2 sentences max
- Include 1-2 relevant emojis that enhance the tone
- Start with a hook or attention-grabber
- Include subtle curiosity or a call-to-action to encourage a reply
- Match the ${tone} tone perfectly (friendly, confident, or flirty)
- Be casual, human, and engaging, like texting a friend you’re interested in
- Be contextually perfect for the image

If the image is unclear, generate charming, safe, and friendly replies that still feel natural.

IMPORTANT: Return ONLY a valid JSON array with no markdown, code blocks, or extra text. Format:
[
  {
    "text": "Your reply suggestion here with emoji 🔥",
    "description": "Why this reply is engaging and works"
  },
  {
    "text": "Second suggestion here 💯",
    "description": "Why this reply is charming and effective"
  },
  {
    "text": "Third suggestion here ✨",
    "description": "Why this reply sparks connection"
  }
]`,

      indonesia: `${toneInstructions[language][tone]}

Kamu adalah coach kencan terbaik yang tahu cara bikin pesan menarik, playful, dan hangat. Analisis gambar Instagram story/post ini dengan cermat: perhatikan mood orang, aktivitas, konteks, outfit, teks, dan karakter mereka. Sesuaikan balasan dengan vibe dan personality orang tersebut. Bayangkan kamu ingin mengirim 3 pesan yang bikin mereka tersenyum, tertawa, atau penasaran.

Hasilkan tepat 3 saran balasan. Setiap saran harus:
- 1-2 kalimat maksimal
- Sertakan 1-2 emoji yang relevan yang menambah vibe pesan
- Mulai dengan hook atau attention-grabber
- Sertakan rasa penasaran atau call-to-action subtle untuk mendorong reply
- Cocok dengan nada ${tone} (friendly, confident, atau flirty)
- Terdengar casual, manusiawi, dan engaging, seperti nge-chat teman yang kamu tertarikin
- Sesuai konteks gambar dengan sempurna

Jika gambar tidak jelas, hasilkan balasan yang tetap charming, aman, dan friendly tapi terdengar natural.

PENTING: Return HANYA array JSON yang valid tanpa markdown, code block, atau teks tambahan. Format:
[
  {
    "text": "Saran balasan kamu di sini dengan emoji 🔥",
    "description": "Kenapa balasan ini menarik dan efektif"
  },
  {
    "text": "Saran kedua di sini 💯",
    "description": "Kenapa balasan ini charming dan bekerja"
  },
  {
    "text": "Saran ketiga di sini ✨",
    "description": "Kenapa balasan ini bikin koneksi"
  }
]`,
    };

    // Fallback suggestions based on language
    const fallbackSuggestions = {
      english: [
        {
          text: "That's awesome! Tell me more about that 🔥",
          description: "Shows genuine interest",
        },
        {
          text: "Looking great! What's the occasion? 💯",
          description: "Engaging and curious",
        },
        {
          text: "Love this vibe! How was it? ✨",
          description: "Positive and conversational",
        },
      ],
      indonesia: [
        {
          text: "Keren banget! Cerita dong lebih lanjut 🔥",
          description: "Menunjukkan ketertarikan yang tulus",
        },
        {
          text: "Kelihatan bagus! Ada acara apa nih? 💯",
          description: "Engaging dan penasaran",
        },
        {
          text: "Suka vibe-nya! Gimana tadi? ✨",
          description: "Positif dan conversational",
        },
      ],
    };

    const contents = [
      {
        inlineData: {
          mimeType: mimeType,
          data: imageData,
        },
      },
      {
        text: prompts[language],
      },
    ];

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: contents,
    });

    console.log("Gemini AI Raw Response:", result.text);

    // Parse the JSON response
    let suggestions;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = result.text.trim();
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
      suggestions = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Response text:", result.text);

      // Fallback suggestions based on language
      suggestions = fallbackSuggestions[language];
    }

    return Response.json({
      success: true,
      suggestions: suggestions,
      rawResponse: result.text,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
