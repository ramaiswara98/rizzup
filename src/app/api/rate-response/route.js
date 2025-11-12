import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { language = 'english', scenario, userReply } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompts = {
      english: `Analyze this chat reply and rate it on a scale of 0-100.

Scenario Context: ${scenario.context}
Their Message: "${scenario.message}"
Situation: ${scenario.situation}

User's Reply: "${userReply}"

Rate based on:
1. Appropriateness for the context and relationship
2. Engagement level and interest shown
3. Tone and emotional intelligence
4. Conversation continuation potential
5. Natural flow and timing
6. Personality and authenticity

Be honest and constructive. Most replies should score 40-70. Only exceptional replies deserve 80+.

Scoring Guide:
- 0-20: Poor (Major issues, inappropriate, or confusing)
- 21-40: Below Average (Significant problems, needs work)
- 41-60: Average (Acceptable but room for improvement)
- 61-75: Good (Solid reply, minor improvements possible)
- 76-89: Excellent (Strong performance, well-crafted)
- 90-100: Outstanding (Exceptional, rare)

Return ONLY valid JSON with no markdown, no code blocks:
{
  "score": 65,
  "rating": "Good",
  "emoji": "👍",
  "summary": "Solid reply with good energy and natural flow",
  "strengths": ["Shows genuine interest", "Maintains friendly tone", "Keeps conversation going"],
  "improvements": ["Could add more personality", "A bit generic", "Missing opportunity for humor"],
  "suggestion": "Try adding a specific question or personal detail to make it more engaging and memorable."
}`,

      indonesia: `Analisis balasan chat ini dan beri nilai skala 0-100.

Konteks Skenario: ${scenario.context}
Pesan Mereka: "${scenario.message}"
Situasi: ${scenario.situation}

Balasan User: "${userReply}"

Nilai berdasarkan:
1. Kesesuaian dengan konteks dan hubungan
2. Level engagement dan ketertarikan yang ditunjukkan
3. Tone dan kecerdasan emosional
4. Potensi kelanjutan percakapan
5. Alur natural dan timing
6. Kepribadian dan keaslian

Jujur dan konstruktif. Kebanyakan balasan harus skor 40-70. Hanya balasan exceptional yang layak 80+.

Panduan Skor:
- 0-20: Buruk (Masalah besar, tidak sesuai, atau membingungkan)
- 21-40: Di Bawah Rata-rata (Masalah signifikan, perlu perbaikan)
- 41-60: Rata-rata (Dapat diterima tapi perlu perbaikan)
- 61-75: Bagus (Balasan solid, perbaikan kecil mungkin)
- 76-89: Sangat Bagus (Performa kuat, well-crafted)
- 90-100: Luar Biasa (Exceptional, jarang)

Return HANYA JSON valid tanpa markdown, tanpa code blocks:
{
  "score": 65,
  "rating": "Bagus",
  "emoji": "👍",
  "summary": "Balasan solid dengan energi bagus dan alur natural",
  "strengths": ["Menunjukkan ketertarikan tulus", "Menjaga tone ramah", "Menjaga percakapan berjalan"],
  "improvements": ["Bisa tambah kepribadian", "Agak generic", "Kehilangan kesempatan untuk humor"],
  "suggestion": "Coba tambahkan pertanyaan spesifik atau detail personal untuk lebih engaging dan memorable."
}`
    };

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ text: prompts[language] }],
    });

    console.log('Gemini AI Raw Response:', result.text);

    // Parse the JSON response
    let rating;
    try {
      let cleanedResponse = result.text.trim();
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      rating = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      
      // Fallback ratings
      const fallbacks = {
        english: {
          score: 50,
          rating: "Average",
          emoji: "💭",
          summary: "Standard reply with room for improvement",
          strengths: ["Clear message", "Polite tone"],
          improvements: ["Add more personality", "Be more specific", "Show more enthusiasm"],
          suggestion: "Try to be more specific and engaging in your responses. Add personal touches."
        },
        indonesia: {
          score: 50,
          rating: "Rata-rata",
          emoji: "💭",
          summary: "Balasan standar dengan ruang untuk perbaikan",
          strengths: ["Pesan jelas", "Tone sopan"],
          improvements: ["Tambah kepribadian", "Lebih spesifik", "Tunjukkan lebih banyak antusiasme"],
          suggestion: "Coba lebih spesifik dan engaging dalam responmu. Tambahkan sentuhan personal."
        }
      };
      rating = fallbacks[language];
    }

    return Response.json({ 
      success: true, 
      rating
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}