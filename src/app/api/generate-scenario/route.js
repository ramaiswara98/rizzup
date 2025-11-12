import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { language = 'english' } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompts = {
      english: `Generate a realistic and engaging chat scenario for dating or flirting (rizz) practice. 
The tone should vary — sometimes playful, sometimes deep, sometimes shy, sometimes confident — 
but always feel natural and emotionally believable.

Include in the JSON:
1. "context" — describe the relationship or situation briefly (e.g. "someone you matched with recently", "someone you’ve been talking to for a few days", "a person you just met at an event").
2. "message" — what they say to you (make it sound natural, emotionally nuanced, not exaggerated).
3. "situation" — a short description of what’s happening or why they’re texting.

Do NOT include any names or gender references.
Do NOT use markdown or code blocks.
Return ONLY valid JSON:
{
  "context": "Someone you matched with recently on a dating app",
  "message": "Hey, I can't stop thinking about our conversation yesterday. You’ve got this calm vibe I really like.",
  "situation": "They’re trying to keep the conversation going after good chemistry."
}`,

      indonesia: `Buat skenario chat yang realistis dan menarik untuk latihan flirting atau percakapan PDKT (rizz). 
Gaya bisa beragam — kadang lucu, kadang dalam, kadang malu-malu, kadang percaya diri — 
tapi tetap terasa natural dan wajar secara emosional.

Sertakan dalam format JSON:
1. "context" — jelaskan secara singkat hubungan atau situasinya (contoh: "seseorang yang baru kamu match di aplikasi dating", "teman yang mulai sering chat akhir-akhir ini").
2. "message" — isi pesan dari orang tersebut (buat terasa alami, tidak berlebihan).
3. "situation" — deskripsi singkat tentang konteks kenapa dia mengirim pesan itu.

Jangan sertakan nama atau gender apa pun.
Jangan gunakan markdown atau code blocks.
Kembalikan HANYA JSON valid:
{
  "context": "Seseorang yang baru kamu match di aplikasi dating",
  "message": "Aku nggak nyangka ngobrol sama kamu bakal se-seru ini, kamu orangnya asik banget ternyata.",
  "situation": "Dia ingin melanjutkan percakapan setelah merasa cocok."
}`
    };

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ 
        text: `${prompts[language]} Respond strictly as pure JSON only, no markdown, no extra text. Start directly with "{" and end with "}".` 
      }],
    });

    console.log('Gemini AI Raw Response:', result.text);

    // Parse the JSON response
    let scenario;
    try {
      let cleanedResponse = result.text.trim();
      cleanedResponse = cleanedResponse
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '')
        .trim();

      scenario = JSON.parse(cleanedResponse);

      if (!scenario.context || !scenario.message) {
        throw new Error('Incomplete JSON object');
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, '\nRaw:', result.text);

      const fallbacks = {
        english: {
          context: "Someone new you’ve been chatting with",
          message: "You make texting way too fun. Are you like this in person too?",
          situation: "They’re playfully flirting to keep the vibe going."
        },
        indonesia: {
          context: "Seseorang baru yang mulai sering chat denganmu",
          message: "Kamu bikin chatting jadi seru banget. Aslinya juga segini asik nggak?",
          situation: "Dia sedang menggoda dengan cara halus dan ramah."
        }
      };
      scenario = fallbacks[language];
    }

    return Response.json({ 
      success: true, 
      scenario
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
