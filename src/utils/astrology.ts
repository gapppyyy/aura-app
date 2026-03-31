export const ZODIAC_SIGNS = [
  { id: 'aries', sl: 'Oven', en: 'Aries', emoji: '♈️', element: 'ognjeno' },
  { id: 'taurus', sl: 'Bik', en: 'Taurus', emoji: '♉️', element: 'zemeljsko' },
  { id: 'gemini', sl: 'Dvojčka', en: 'Gemini', emoji: '♊️', element: 'zračno' },
  { id: 'cancer', sl: 'Rak', en: 'Cancer', emoji: '♋️', element: 'vodno' },
  { id: 'leo', sl: 'Lev', en: 'Leo', emoji: '♌️', element: 'ognjeno' },
  { id: 'virgo', sl: 'Devica', en: 'Virgo', emoji: '♍️', element: 'zemeljsko' },
  { id: 'libra', sl: 'Tehtnica', en: 'Libra', emoji: '♎️', element: 'zračno' },
  { id: 'scorpio', sl: 'Škorpijon', en: 'Scorpio', emoji: '♏️', element: 'vodno' },
  { id: 'sagittarius', sl: 'Strelec', en: 'Sagittarius', emoji: '♐️', element: 'ognjeno' },
  { id: 'capricorn', sl: 'Kozorog', en: 'Capricorn', emoji: '♑️', element: 'zemeljsko' },
  { id: 'aquarius', sl: 'Vodnar', en: 'Aquarius', emoji: '♒️', element: 'zračno' },
  { id: 'pisces', sl: 'Ribi', en: 'Pisces', emoji: '♓️', element: 'vodno' },
];

export function getZodiacSign(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 1-12

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10];
  return ZODIAC_SIGNS[11]; // Pisces
}
