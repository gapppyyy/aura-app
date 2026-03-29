import axios from 'axios';

// IMPORTANT: This is your live API key. For maximum security in the future,
// you should use a backend (Supabase Edge Functions, etc.) to keep it hidden.
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export const generateAuraReading = async (userData: any, faceData: any, language: string) => {
  try {
    const prompt = `
      You are Solaura AI, a mystical and professional spiritual oracle powered by advanced machine learning. 
      Analyze the following user data and facial metadata to provide an extremely high-end, personalized, and deep spiritual reading.
      
      USER DATA:
      - Age: ${userData.age}
      - Life Focus: ${userData.focus}
      - Current Feeling: ${userData.mood}
      - Future Goal: ${userData.goal}
      
      FACIAL METADATA (from Cameraland):
      - Measured Stress (0-1): ${faceData.stress}
      - Measured Energy (0-1): ${faceData.energy}
      - Measured Balance (0-1): ${faceData.balance}

      OUTPUT JSON FORMAT (STRICT):
      {
        "aura_color": "indigo/jade/ruby/gold/violet",
        "aura_title": "Short mystical title",
        "aura_description": "2-3 paragraphs of deep spiritual analysis based on inputs. Be specific, poetic, and profound.",
        "resonance_percent": number (0-100),
        "scenarios": {
          "current": "A detailed sentence about their current resonance path",
          "optimized": "A detailed sentence about how to align for a better future",
          "risk": "A detailed sentence about potential karmic obstacles to avoid"
        }
      }

      Language: ${language === 'sl' ? 'Slovenian' : 'English'}. 
      Tone: Mystical, sophisticated, uplifting, expensive-feeling. 
      Instructions: Use metaphors like 'Soul Mission', 'Karmic Anchor', 'Astral Flow', 'Twin Flame Resonance' as appropriate.
      Analyze a person for a spiritual Aura reading.
      Input: Age ${userData.age}, Focus ${userData.focus}, Manifestation Goal: ${userData.goal}.
      
      Return a JSON object in this format:
      {
        "color": "indigo | jade | ruby | gold | violet",
        "title": "Short mystical title",
        "description": "3-4 long, deep spiritual paragraphs in ${language === 'sl' ? 'Slovenian' : 'English'}",
        "resonance": number between 60-99,
        "scenarios": { "current": "string", "optimized": "string", "risk": "string" }
      }
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.85, 
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error: any) {
    console.error('AI Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return {
      color: 'violet',
      title: 'Astral Connection Lag',
      description: 'The universe is currently busy. Please check your celestial connection and try again.',
      resonance: 44,
      scenarios: { current: '...', optimized: '...', risk: '...' }
    };
  }
};
