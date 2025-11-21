// app/api/generate-reply/route.js
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const {
      imageData,
      mimeType,
      tone,
      language = "english",
      fileType,
    } = await request.json();

    console.log("language = " + language);
    console.log("tone = " + tone);

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Language-specific tone instructions for STORY/POST replies
    const storyToneInstructions = {
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

    // Language-specific tone instructions for CHAT replies
    const chatToneInstructions = {
      english: {
        friendly:
          "Act as a dating coach. Generate 3 friendly and engaging replies that naturally continue the conversation with warmth and authenticity.",
        confident:
          "Act as a dating coach. Generate 3 confident replies that show you're interesting, self-assured, and know how to keep the conversation flowing.",
        flirty:
          "Act as a dating coach. Generate 3 flirty and playful replies that build romantic tension while keeping the conversation light and fun.",
      },
      indonesia: {
        friendly:
          "Bertindaklah sebagai pelatih kencan. Hasilkan 3 balasan ramah dan engaging yang melanjutkan percakapan dengan natural, hangat, dan autentik.",
        confident:
          "Bertindaklah sebagai pelatih kencan. Hasilkan 3 balasan percaya diri yang menunjukkan kamu menarik, yakin, dan tahu cara menjaga alur percakapan.",
        flirty:
          "Bertindaklah sebagai pelatih kencan. Hasilkan 3 balasan flirty dan playful yang membangun romantic tension sambil tetap ringan dan fun.",
      },
    };

    // Build the prompt based on language
    let promptText = "";

    if (language === "indonesia") {
  promptText = `Kamu adalah AI coach kencan profesional. Analisis screenshot ini dengan SANGAT CERMAT dan pahami alur percakapan secara akurat.

====================================================
LANGKAH 1: Tentukan tipe screenshot
====================================================
- CHAT SCREENSHOT: Ada chat bubbles, pesan masuk/keluar, percakapan dari WhatsApp/Instagram DM/Telegram
- STORY/POST: Foto, posting, story, outfit, aktivitas, atau mood yang ingin di-reply

====================================================
ATURAN KRITIS UNTUK CHAT SCREENSHOT
====================================================
Untuk bisa menjawab dengan benar, kamu HARUS memahami dua hal penting:

1) **Membedakan pesan kita (pengirim) dan pesan mereka (penerima)**  
Gunakan petunjuk visual seperti posisi bubble (kanan = pesan kita, kiri = pesan mereka), warna bubble, alignment, atau elemen UI lainnya.  
Balas HANYA pesan terakhir dari *mereka* dan abaikan pesan terakhir dari *kita*.

2) **Jangan tertipu oleh “reply preview” di bubble kita**  
Pada beberapa aplikasi chat, bubble kita menampilkan potongan pesan mereka di atas (reply preview).  
WAJIB dipahami bahwa:
- Preview tersebut BUKAN pesan baru dari mereka  
- Tidak boleh dijadikan konteks jawaban  
- Tidak boleh diulang, disalin, atau disebut dalam balasan  

====================================================
LANGKAH 2: Analisis WAJIB sebelum membalas
====================================================
Sebelum membuat balasan, lakukan 3 langkah ini:

1) IDENTIFIKASI pesan terakhir dari mereka (bukan preview, bukan pesan kita)  
2) PAHAMI maksud pesan terakhir tersebut:  
   - Apakah bertanya, memberi informasi, bercanda, menggoda, ragu, menutup topik, atau membuka topik baru  
3) BUAT balasan yang langsung merespons maksud pesan terakhir:  
   - Relevan secara logis, tidak keluar konteks, tidak mengarang detail yang tidak ada  
   - Maksimal 1–2 kalimat  
   - Sertakan 1–2 emoji  
   - Respons natural, manusiawi  
   - Tone: ${tone}

====================================================
LANGKAH 3: Jika STORY/POST
====================================================
${storyToneInstructions.indonesia[tone]}

- 1–2 kalimat  
- Sertakan 1–2 emoji  
- Mulai dengan hook yang menarik  
- Referensi detail khusus dari gambar  
- Tone: ${tone}

====================================================
INSTRUKSI FINAL - WAJIB 100%
====================================================
✅ Semua teks & deskripsi harus dalam BAHASA INDONESIA  
❌ Jangan gunakan bahasa Inggris sama sekali  
❌ Jangan gunakan markdown atau code blocks  
✅ Return HANYA JSON  

Format EXACT:
{
  "type": "chat",
  "suggestions": [
    {
      "text": "Balasan pertama dalam Bahasa Indonesia 🔥",
      "description": "Penjelasan dalam Bahasa Indonesia"
    },
    {
      "text": "Balasan kedua dalam Bahasa Indonesia 💯",
      "description": "Penjelasan dalam Bahasa Indonesia"
    },
    {
      "text": "Balasan ketiga dalam Bahasa Indonesia ✨",
      "description": "Penjelasan dalam Bahasa Indonesia"
    }
  ]
}
`;
} else {
  promptText = `You are a professional dating coach AI. Analyze the screenshot VERY CAREFULLY and understand the full flow of the conversation.

====================================================
STEP 1: Determine screenshot type
====================================================
- CHAT SCREENSHOT: Chat bubbles, incoming/outgoing messages, history from WhatsApp/Instagram DM/Telegram  
- STORY/POST: A photo with outfit/mood/activity to reply to  

====================================================
CRITICAL RULES FOR CHAT SCREENSHOTS
====================================================
1) **Differentiate between our messages and their messages**  
Use visual cues such as bubble alignment (right = ours, left = theirs), colors, shapes, or UI indicators.  
Reply ONLY to *their* last message, NOT ours.

2) **Do NOT get fooled by the "reply preview" inside our bubble**  
Reply preview is a quoted fragment of their message above our message.  
- It is NOT a new message  
- It must NOT be treated as the last message  
- Do NOT repeat, copy, or reference it

====================================================
STEP 2: Mandatory Analysis before replying
====================================================
Before replying, perform 3 steps:

1) Identify the actual last message from them (ignore preview and our own message)  
2) Understand the intent of that last message:
   - Is it a question, information, joke, tease, unsure, closing a topic, or opening a topic?  
3) Compose a reply that directly responds to the intent:
   - Logical, contextually relevant, no invented details  
   - 1–2 sentences max  
   - Include 1–2 emojis  
   - Natural, human-like response  
   - Tone: ${tone}  

====================================================
STEP 3: If STORY/POST
====================================================
${storyToneInstructions.english[tone]}

- 1–2 sentences  
- Include 1–2 emojis  
- Start with engaging hook  
- Reference specific detail from the image  
- Tone: ${tone}  

====================================================
FINAL INSTRUCTIONS - MUST FOLLOW
====================================================
✅ All text & descriptions must be in ENGLISH  
❌ No mixed languages  
❌ No markdown/code blocks  
✅ Return ONLY JSON  

Exact format:
{
  "type": "chat",
  "suggestions": [
    {
      "text": "First reply in English 🔥",
      "description": "Explanation in English"
    },
    {
      "text": "Second reply in English 💯",
      "description": "Explanation in English"
    },
    {
      "text": "Third reply in English ✨",
      "description": "Explanation in English"
    }
  ]
}
`;
}



    console.log("Selected prompt language:", language);

    // Fallback suggestions based on language and type
    const fallbackSuggestions = {
      english: {
        chat: [
          {
            text: "Haha that's interesting! What made you think of that? 🤔",
            description: "Shows engagement and curiosity",
          },
          {
            text: "I feel you on that. Have you tried anything similar? 💯",
            description: "Empathetic and helpful",
          },
          {
            text: "No way! Tell me more about that 😄",
            description: "Enthusiastic and encouraging",
          },
        ],
        story: [
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
      },
      indonesia: {
        chat: [
          {
            text: "Haha menarik! Apa yang bikin kamu kepikiran itu? 🤔",
            description: "Menunjukkan engagement dan rasa penasaran",
          },
          {
            text: "Gue ngerti sih. Udah coba yang sejenis belum? 💯",
            description: "Empati dan membantu",
          },
          {
            text: "Serius? Cerita dong lebih lanjut 😄",
            description: "Antusias dan mendorong",
          },
        ],
        story: [
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
      },
    };

    const contents = [
      {
        inlineData: {
          mimeType: mimeType,
          data: imageData,
        },
      },
      {
        text: promptText,
      },
    ];

    console.log("Sending to Gemini API...");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    console.log("Gemini AI Raw Response:", result.text);

    // Parse the JSON response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = result.text.trim();
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");

      console.log("Cleaned response:", cleanedResponse);

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Response text:", result.text);

      // Fallback suggestions based on language - default to story
      parsedResponse = {
        type: "story",
        suggestions:
          fallbackSuggestions[language]?.story ||
          fallbackSuggestions.english.story,
      };
    }

    // Ensure we have the type and suggestions
    const responseType = parsedResponse.type || "story";
    const suggestions =
      parsedResponse.suggestions ||
      fallbackSuggestions[language]?.[responseType] ||
      fallbackSuggestions[language]?.story ||
      fallbackSuggestions.english.story;

    return Response.json({
      success: true,
      type: responseType,
      suggestions: suggestions,
      language: language,
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
