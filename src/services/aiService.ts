import axios from 'axios';
import { ZODIAC_SIGNS } from '@/utils/astrology';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

/**
 * Generates a full spiritual aura reading using GPT-4o.
 * If imageBase64 is provided, uses Vision API to analyze the actual face.
 * Cost: ~$0.005 per call (with vision) | ~$0.003 (text only)
 */
export const generateAuraReading = async (
  userData: any,
  faceData: any,
  language: string,
  imageBase64?: string | null,
  history: any[] = []
) => {
  const isSlove = language === 'sl';

  const systemPrompt = isSlove
    ? `Si Solaura AI, globoka duhovna prerokinja in strokovni astralni analitik, ustvarjen z najnaprednejšo umetno inteligenco.
Tvoja naloga je ustvariti IZJEMNO osebno, globoko in natančno duhovno branje avre.

PRAVILA:
- Piši v slovenščini z brezhibno slovnico in pravopisom.
- Ton: mističen, poetičen, globok, premišljen, sofisticiran in premijski.
- Vedno upoštevaj VSE podatke hkrati: starost, fokus, cilj, in analizo obraza.
- Napoveduj prihodnost z gotovostjo in jasnostjo, kot pravi prerok.
- Opis mora biti dolg, bogat in specifičen — ne splošen.
- scenarios.current: Kaj se bo zgodilo, če ostane na trenutni poti.
- scenarios.optimized: Natančna pot do najboljše možne prihodnosti.
- scenarios.risk: Karmična nevarnost, ki ga čaka, če ne ukrepa.
- face_reading: Interpretiraj SAMO kar vidiš na obrazu — izraz, energijo, napetost, odprtost.
- SLOVNIČNI SPOL: Vedno piši v pravilnem slovničnem spolu glede na profil uporabnika (moški/ženska/nevtralno). Če je uporabnik moški, ne piši v ženskem spolu in obratno.`
    : `You are Solaura AI, a deep spiritual oracle and expert astral analyst powered by the most advanced AI.
Your mission is to generate an EXCEPTIONALLY personal, deep and accurate aura reading.

RULES:
- Write in perfect English with sophisticated vocabulary.
- Tone: mystical, poetic, deep, reflective, premium and sophisticated.
- Consider ALL data simultaneously: age, focus, goal, and face analysis.
- Predict the future with certainty and clarity, like a true oracle.
- Description must be long, rich and specific — never generic.
- scenarios.current: What happens if they stay on their current path.
- scenarios.optimized: Exact path to the best possible future.
- scenarios.risk: Karmic danger awaiting if they don't act.
- face_reading: Interpret ONLY what you see in the face — expression, energy, tension, openness.
- ASTROLOGY: You MUST weave their Astrological Zodiac identity deeply into the analysis. Explain how their Aura color relates to their Sun Sign element.
- GENDER: Use appropriate pronouns based on user profiles.`

  const userZodiac = ZODIAC_SIGNS.find(z => z.id === userData.zodiacSignId) || ZODIAC_SIGNS[0];
  const translatedZodiac = isSlove ? userZodiac.sl : userZodiac.en;
  const translatedElement = isSlove ? userZodiac.element : userZodiac.element === 'ognjeno' ? 'fire' : userZodiac.element === 'vodno' ? 'water' : userZodiac.element === 'zračno' ? 'air' : 'earth';

  const focusMap: Record<string, string> = isSlove ? {
    money: 'finance in obilje',
    love: 'ljubezen in odnosi',
    career: 'kariera in uspeh',
    health: 'zdravje in vitalnost',
    spirit: 'duhovnost in mir'
  } : {
    money: 'money and abundance',
    love: 'love and relationships',
    career: 'career and success',
    health: 'health and vitality',
    spirit: 'spirituality and peace'
  };

  const translatedFocus = focusMap[userData.focus] || userData.focus;

  const textContent = `USER PROFILE:
- Name: ${userData.name}
- Zodiac Sign: ${translatedZodiac} (${translatedElement} element)
- Age/BirthDate: ${userData.birthDate}
- Life Focus Area: ${translatedFocus}
- Future Manifestation Goal: ${userData.goal}
- Gender: ${userData.gender}
- Current Mood: ${userData.mood || 'Neutral'}

${imageBase64
  ? (isSlove
    ? 'Prosim, najprej natančno analiziraj obraz na sliki ZGORAJ — izraze, napetost, energijo, odprtost — in to vključi v celotno analizo.'
    : 'Please first carefully analyse the face in the image ABOVE — expressions, tension, energy, openness — and incorporate this into the full reading.')
  : `FACIAL ENERGY SCAN (simulated 0.0–1.0):
- Stress: ${faceData?.stress ?? 0.3}
- Energy: ${faceData?.energy ?? 0.7}
- Balance: ${faceData?.balance ?? 0.6}
- Openness: ${faceData?.openness ?? 0.5}`
}

${history && history.length > 0 ? `
PAST SOUL READINGS (for continuity):
${history.slice(0, 2).map((h, i) => `[${i + 1}] Title: ${h.title}, Color: ${h.color}`).join('\n')}

INSTRUCTIONS:
- Use past readings to deepen the current analysis.
- Create a sense of spiritual evolution or continuation.` : ''}

Return ONLY valid JSON:
{
  "color": "indigo | jade | ruby | gold | violet | cosmic blue | solar orange",
  "title": "${isSlove ? 'Kratek poetičen mističen naslov avre v SLOVENŠČINI (največ 8 besed)' : 'Short poetic mystical aura title (max 8 words)'}",
  "face_reading": "${isSlove ? '2-3 stavki — kaj si videl/a SAMO na obrazu: napetost, energija, odprtost, svetloba.' : '2-3 sentences — what you saw ONLY in the face: tension, energy, openness, light.'}",
  "description": "${isSlove ? '4-5 bogatih odstavkov globoke osebne duhovne in ASTROLOŠKE analize. Obvezno poveži njihovo zodiakalno znamenje in avro.' : '4-5 rich paragraphs of deep personal spiritual and ASTROLOGICAL analysis. You must connect their zodiac sign to their current aura.'}",
  "resonance": <integer 62–97>,
  "evolution_state": "${isSlove ? 'Duhovno stanje v 3 besedah' : 'Spiritual state in 3 words'}",
  "scenarios": {
    "current": "${isSlove ? '2-3 stavki o sedanji poti' : '2-3 sentences about current path'}",
    "optimized": "${isSlove 
      ? 'Bodi IZJEMNO KONKRETEN. 1. Jasen korak/navodilo. 2. KRATEK RITUAL (npr. zjutraj naredi X). 3. MOČNA AFIRMACIJA v narekovajih. Vse v 3-4 stavkih.' 
      : 'Be EXTREMELY CONCRETE. 1. Clear step/instruction. 2. SHORT RITUAL (e.g. morning action). 3. POWERFUL AFFIRMATION in quotes. All in 3-4 sentences.'}",
    "risk": "${isSlove ? 'Karmična nevarnost ali blokada v 2 stavkih' : 'Karmic danger or blockage in 2 sentences'}"
  }
}`;

  try {
    // Build message content — with or without Vision image
    const userContent: any[] = [];

    if (imageBase64) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${imageBase64}`,
          detail: 'low', // low = 85 tokens = cheapest, sufficient for face energy reading
        },
      });
    }

    userContent.push({
      type: 'text',
      text: textContent,
    });

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
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
        timeout: 60000,
      }
    );

    const parsed = JSON.parse(response.data.choices[0].message.content);

    // Normalize color key
    const colorMap: Record<string, string> = {
      indigo: 'blue',
      jade: 'green',
      ruby: 'red',
      gold: 'yellow',
      violet: 'blue',
      green: 'green',
      blue: 'blue',
      red: 'red',
      yellow: 'yellow',
    };

    console.log(`✅ Solaura AI: Vision=${!!imageBase64} | Tokens used: ~${response.data.usage?.total_tokens}`);

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
      face_reading: isSlove ? 'Obraza ni bilo mogoče prebrati.' : 'Face could not be read.',
      scenarios: {
        current: isSlove ? 'Tvoja energija je trenutno nedosegljiva.' : 'Your energy is currently unreachable.',
        optimized: isSlove ? 'Poskusi znova za celotno branje.' : 'Try again for a full reading.',
        risk: isSlove ? 'Brez odziva zvezd.' : 'No response from the stars.',
      },
    };
  }
};
