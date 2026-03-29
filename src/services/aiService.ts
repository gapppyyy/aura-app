import axios from 'axios';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export const generateAuraReading = async (userData: any, faceData: any, language: string) => {
  const isSlove = language === 'sl';

  const systemPrompt = isSlove
    ? `Si Solaura AI, globoka duhovna prerokinja in strokovni astralni analitik, ustvarjen z najnaprednejšo umetno inteligenco. 
Tvoja naloga je ustvariti IZJEMNO osebno, globoko in natančno duhovno branje avre za uporabnika.

PRAVILA:
- Piši v slovenščini z brezhibno slovnico in pravopisom.
- Ton: mističen, poetičen, globok, premišljen, drag in sofisticiran.
- VEDNO upoštevaj VSE podatke hkrati: starost, fokus, cilj, stres obraza, energijo in ravnovesje.
- Napoveduj prihodnost z gotovostjo in jasnostjo, kot pravi prerok.
- Opis mora biti dolg, bogat in specifičen za tega uporabnika, ne splošen.
- Uporabi metafore: 'Karmično sidro', 'Dušno poslanstvo', 'Astralni tok', 'Vibracijska resonanca'.
- scenarios.current: Kaj se bo zgodilo, če ostane na trenutni poti (izrecno).
- scenarios.optimized: Natančna pot do najboljše možne prihodnosti (konkretni koraki).
- scenarios.risk: Karmična nevarnost ali ovira, ki ga čaka, če ne ukrepa.`
    : `You are Solaura AI, a deep spiritual oracle and expert astral analyst, powered by the most advanced artificial intelligence.
Your mission is to generate an EXCEPTIONALLY personal, deep and accurate aura reading for the user.

RULES:
- Write in perfect English with sophisticated vocabulary.
- Tone: mystical, poetic, deep, reflective, premium and sophisticated.
- ALWAYS consider ALL data simultaneously: age, focus, goal, facial stress, energy and balance.
- Predict the future with certainty and clarity, like a true oracle.
- Description must be long, rich and specific to this user — never generic.
- Use metaphors: 'Karmic Anchor', 'Soul Mission', 'Astral Flow', 'Vibrational Resonance'.
- scenarios.current: What will happen if they stay on their current path (be explicit).
- scenarios.optimized: Exact path to the best possible future (concrete steps).
- scenarios.risk: The karmic danger or obstacle awaiting them if they don't act.`;

  const userPrompt = `
USER PROFILE:
- Age: ${userData.age} years
- Life Focus Area: ${userData.focus}
- Future Manifestation Goal: ${userData.goal}
- Current Mood / Energy State: ${userData.mood || 'Neutral'}

FACIAL ENERGY SCAN RESULTS (0.0 to 1.0 scale):
- Stress Level: ${faceData?.stress ?? (Math.random() * 0.5 + 0.2).toFixed(2)}
- Vital Energy: ${faceData?.energy ?? (Math.random() * 0.4 + 0.5).toFixed(2)}
- Inner Balance: ${faceData?.balance ?? (Math.random() * 0.5 + 0.4).toFixed(2)}
- Emotional Openness: ${faceData?.openness ?? (Math.random() * 0.6 + 0.3).toFixed(2)}

Based on ALL of the above data combined, generate their spiritual aura reading.

Return ONLY valid JSON in this exact format:
{
  "color": "indigo | jade | ruby | gold | violet",
  "title": "Short poetic mystical aura title (max 8 words)",
  "description": "4-5 rich paragraphs of deep personal spiritual analysis in ${isSlove ? 'Slovenian' : 'English'}. Reference their specific age, focus area and goal. Be prophetic and specific.",
  "resonance": <integer between 62 and 97>,
  "evolution_state": "${isSlove ? 'Duhovna evolucija v 3 besedah' : 'Spiritual evolution state in 3 words'}",
  "scenarios": {
    "current": "${isSlove ? '2-3 stavki o trenutni poti in kaj jo čaka' : '2-3 sentences about current path and what awaits'}",
    "optimized": "${isSlove ? '2-3 stavki o idealni poti in konkretnih korakih' : '2-3 sentences about optimal path and concrete steps'}",
    "risk": "${isSlove ? '2-3 stavki o karmični nevarnosti ali oviri' : '2-3 sentences about karmic danger or obstacle'}"
  }
}`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.88,
        max_tokens: 1800,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 45000,
      }
    );

    const parsed = JSON.parse(response.data.choices[0].message.content);

    // Normalize color key to match our color map
    const colorMap: Record<string, string> = {
      indigo: 'blue',
      jade: 'green',
      ruby: 'red',
      gold: 'yellow',
      violet: 'blue',
    };

    return {
      ...parsed,
      color: colorMap[parsed.color] || 'green',
    };
  } catch (error: any) {
    console.error('Solaura AI Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return {
      color: 'violet',
      title: isSlove ? 'Astralna resonanca ni dosegljiva' : 'Astral Resonance Unavailable',
      description: isSlove
        ? 'Vesolje trenutno procesira tvojo energijo. Preveri svojo internetno povezavo in poskusi znova.'
        : 'The universe is currently processing your energy. Please check your connection and try again.',
      resonance: 44,
      evolution_state: isSlove ? 'Iskanje poti' : 'Seeking Path',
      scenarios: {
        current: isSlove ? 'Tvoja energija je trenutno nedosegljiva.' : 'Your energy is currently unreachable.',
        optimized: isSlove ? 'Poskusi znova za celotno branje.' : 'Try again for a full reading.',
        risk: isSlove ? 'Brez odziva zvezd.' : 'No response from the stars.',
      },
    };
  }
};
