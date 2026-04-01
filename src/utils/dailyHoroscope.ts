export const HOROSCOPE_THEMES = {
  sl: [
    "Danes je tvoj intuitivni prerez vrhunski. Zaupaj svojim notranjim občutkom in se ne boj tveganja na področju strasti.",
    "Kozmična poravnava ti prinaša nepričakovan zanos. Odlično obdobje za uresničevanje zastalih projektov.",
    "V prihajajočih urah boš začutil/a naravno željo po umirjenosti. Poišči čas zase in obnavljaj svojo energijsko avro.",
    "Zvezde ti nocoj pošiljajo zagon samozavesti. Komunikacija bo tvoje najmočnejše orožje - uporabi ga modro.",
    "Energije kažejo na pomembno preokretnico. Ne boj se zapreti starih vrat, saj se pravkar odpirajo nova, veliko bolj svetla."
  ],
  en: [
    "Today your intuitive slice is superb. Trust your inner feelings and do not fear taking risks in matters of passion.",
    "The cosmic alignment brings you unexpected momentum. An excellent period to realize stalled projects.",
    "In the coming hours, you will feel a natural desire for calmness. Find time for yourself and renew your energy aura.",
    "The stars are sending you a boost of confidence tonight. Communication will be your strongest weapon - use it wisely.",
    "Energies point to a significant turning point. Do not be afraid to close old doors, as new, much brighter ones are opening."
  ]
};

export const LOVE_FORECASTS = {
  sl: [
    "Venera se nasmiha tvojemu znamenju. Pričakuj globoke in iskreče pogovore z ljubljeno osebo ali presenetljivo srčno novo znanstvo.",
    "Čustvena gladina bo danes rahlo razburkana. Bodi potrpežljiv/a, saj je to le prehoden oblak pred močnim soncem.",
    "Romantična energija se krepi. Čas je, da pokažeš svoja prava čustva brez obrambnih zidov.",
    "Planetarna razporeditev sili k razčiščevanju preteklosti. S tistim, kar mora iti, se ne obremenjuj."
  ],
  en: [
    "Venus smiles at your sign. Expect deep, sparkling conversations with a loved one or a surprising new heartfelt acquaintance.",
    "The emotional surface will be slightly turbulent today. Be patient; it is just a passing cloud before a strong sun.",
    "Romantic energy is strengthening. It is time to show your true feelings without defensive walls.",
    "The planetary layout forces the clearing of the past. Do not burden yourself with what must go."
  ]
};

export const CAREER_FORECASTS = {
  sl: [
    "Mars ti vliva neverjetno produktivnost. Danes lahko z lahkoto prepričaš sodelavce in nadrejene v svojo vizijo.",
    "Pazi na finančne izdatke v drugi polovici dneva. Dobro pretehtaj vsako odločitev, še preden se zavežeš.",
    "Kreativne ideje se bodo vrstile ena za drugo. Obvezno si jih zapiši, saj nosijo potencial za neizmeren uspeh.",
    "Delovno okolje morda ne bo popolnoma usklajeno s tabo. Održi profesionalno držo in počakaj, da se valovi umirijo."
  ],
  en: [
    "Mars infuses you with incredible productivity. Today you can easily convince colleagues and superiors of your vision.",
    "Watch out for financial expenses in the second half of the day. Weigh every decision fully before committing.",
    "Creative ideas will come one after another. Be sure to write them down, as they carry the potential for immense success.",
    "The work environment may not be perfectly aligned with you. Maintain a professional posture and wait for the waves to calm down."
  ]
};

export const LUCKY_COLORS = {
  sl: ["Smaragdno zelena", "Kozmično vijolična", "Rubinasto rdeča", "Mornarsko modra", "Sončno rumena", "Biserno bela", "Zlata"],
  en: ["Emerald Green", "Cosmic Purple", "Ruby Red", "Navy Blue", "Sunny Yellow", "Pearl White", "Gold"]
};

// Deterministic random generator based on date and string seed
function seededRandom(seed: number) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate today's unique deterministic cosmic reading
export function generateDailyHoroscope(zodiacId: string, lang: 'sl' | 'en') {
  const currentLang = lang.startsWith('sl') ? 'sl' : 'en';
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
  // Create a numeric seed from zodiac + date
  let seed = 0;
  const combined = zodiacId + dateString;
  for (let i = 0; i < combined.length; i++) {
    seed += combined.charCodeAt(i);
  }

  // Use the seed to pick indices securely
  const dailyThemeIdx = Math.floor(seededRandom(seed) * HOROSCOPE_THEMES[currentLang].length);
  const loveIdx = Math.floor(seededRandom(seed + 1) * LOVE_FORECASTS[currentLang].length);
  const careerIdx = Math.floor(seededRandom(seed + 2) * CAREER_FORECASTS[currentLang].length);
  const colorIdx = Math.floor(seededRandom(seed + 3) * LUCKY_COLORS[currentLang].length);
  const luckyNumber = Math.floor(seededRandom(seed + 4) * 99) + 1; // 1-99
  
  // Power percentage
  const powerStat = Math.floor(seededRandom(seed + 5) * 40) + 60; // 60-100%

  return {
    theme: HOROSCOPE_THEMES[currentLang][dailyThemeIdx],
    love: LOVE_FORECASTS[currentLang][loveIdx],
    career: CAREER_FORECASTS[currentLang][careerIdx],
    luckyColor: LUCKY_COLORS[currentLang][colorIdx],
    luckyNumber,
    powerStat
  };
}
