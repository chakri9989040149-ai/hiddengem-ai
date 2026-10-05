/**
 * TRAVEL TRANSLATOR SERVICE
 * Supports major Indian regional languages & bidirectional conversation translation.
 */

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speechCode: 'or-IN' },
];

// Rich travel phrase translations across Indian states
interface PhraseMap {
  en: string;
  te: string;
  ml: string;
  ta: string;
  kn: string;
  hi: string;
}

const COMMON_TRAVEL_PHRASES: PhraseMap[] = [
  {
    en: 'Where is the bus stand?',
    te: 'బస్ స్టాండ్ ఎక్కడ ఉంది?',
    ml: 'ബസ് സ്റ്റാൻഡ് എവിടെയാണ്?',
    ta: 'பேருந்து நிலையம் எங்கே உள்ளது?',
    kn: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
    hi: 'बस स्टैंड कहाँ है?',
  },
  {
    en: 'How do I reach this place?',
    te: 'ఈ ప్రదేశానికి ఎలా వెళ్లాలి?',
    ml: 'ഈ സ്ഥലത്തേക്ക് എങ്ങനെ പോകാം?',
    ta: 'இந்த இடத்திற்கு எப்படி செல்வது?',
    kn: 'ಈ ಸ್ಥಳಕ್ಕೆ ಹೇಗೆ ಹೋಗುವುದು?',
    hi: 'इस जगह कैसे पहुँचे?',
  },
  {
    en: 'Where can I get vegetarian food?',
    te: 'శాకాహార భోజనం ఎక్కడ దొరుకుతుంది?',
    ml: 'സസ്യാഹാരം എവിടെ കിട്ടും?',
    ta: 'சைவ உணவு எங்கே கிடைக்கும்?',
    kn: 'ಸಸ್ಯಾಹಾರ ಊಟ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?',
    hi: 'शाकाहारी खाना कहाँ मिलेगा?',
  },
  {
    en: 'How much does this cost?',
    te: 'దీని ధర ఎంత?',
    ml: 'ഇതിന് എത്ര വിലയാകും?',
    ta: 'இதன் விலை என்ன?',
    kn: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
    hi: 'यह कितने का है?',
  },
  {
    en: 'Is this place safe for family and children?',
    te: 'ఈ ప్రదేశం కుటుంబం మరియు పిల్లలకు సురక్షితమేనా?',
    ml: 'ഈ സ്ഥലം കുടുംബത്തിനും കുട്ടികൾക്കും സുരക്ഷിതമാണോ?',
    ta: 'இந்த இடம் குடும்பத்தினருக்கும் குழந்தைகளுக்கும் பாதுகாப்பானதா?',
    kn: 'ಈ ಸ್ಥಳ ಕುಟುಂಬ ಮತ್ತು ಮಕ್ಕಳಿಗೆ ಸುರಕ್ಷಿತವೇ?',
    hi: 'क्या यह जगह परिवार और बच्चों के लिए सुरक्षित है?',
  },
  {
    en: 'Where is the nearest hospital or pharmacy?',
    te: 'సమీపంలోని ఆసుపత్రి లేదా మెడికల్ షాప్ ఎక్కడ ఉంది?',
    ml: 'ഏറ്റവും അടുത്തുള്ള ആശുപത്രി അല്ലെങ്കിൽ മെഡിക്കൽ ഷോപ്പ് എവിടെയാണ്?',
    ta: 'அருகிலுள்ள மருத்துவமனை அல்லது மருந்தகம் எங்கே உள்ளது?',
    kn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಅಥವಾ ಔಷಧಾಲಯ ಎಲ್ಲಿದೆ?',
    hi: 'निकटतम अस्पताल या दवा की दुकान कहाँ है?',
  },
  {
    en: 'Can you show me the route on the map?',
    te: 'మ్యాప్‌లో రూట్ చూపించగలరా?',
    ml: 'മാപ്പിൽ വഴി കാണിച്ചുതരാമോ?',
    ta: 'வரைபடத்தில் வழியைக் காட்ட முடியுமா?',
    kn: 'ನಕ್ಷೆಯಲ್ಲಿ ದಾರಿ ತೋರಿಸಬಹುದೇ?',
    hi: 'क्या आप मैप पर रास्ता दिखा सकते हैं?',
  },
  {
    en: 'Thank you very much for your help!',
    te: 'మీ సహాయానికి చాలా ధన్యవాదాలు!',
    ml: 'നിങ്ങളുടെ സഹായത്തിന് വളരെ നന്ദി!',
    ta: 'உங்கள் உதவிக்கு மிக்க நன்றி!',
    kn: 'ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು!',
    hi: 'आपकी मदद के लिए बहुत-बहुत धन्यवाद!',
  },
];

export async function translateTravelText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';
  if (sourceLang === targetLang) return trimmed;

  // 1. Check exact phrase match
  const lower = trimmed.toLowerCase();
  for (const phrase of COMMON_TRAVEL_PHRASES) {
    const srcVal = (phrase as any)[sourceLang]?.toLowerCase();
    if (srcVal && (srcVal === lower || lower.includes(srcVal) || srcVal.includes(lower))) {
      const tgtVal = (phrase as any)[targetLang];
      if (tgtVal) return tgtVal;
    }
  }

  // 2. Keyword fallback translations for common travel vocabulary
  const vocabMap: Record<string, Record<string, string>> = {
    restroom: {
      te: 'రెస్ట్‌రూమ్ / టాయిలెట్',
      ml: 'ടോയ്‌ലറ്റ് / വിശ്രമമുറി',
      ta: 'கழிப்பறை',
      kn: 'ಶೌಚಾಲಯ',
      hi: 'शौचालय',
    },
    waterfall: {
      te: 'జలపాతం',
      ml: 'വെള്ളച്ചാട്ടം',
      ta: 'அருவி',
      kn: 'ಜಲಪಾತ',
      hi: 'झरना',
    },
    temple: {
      te: 'గుడి / దేవాలయం',
      ml: 'ക്ഷേത്രം',
      ta: 'கோவில்',
      kn: 'ದೇವಾಲಯ',
      hi: 'मंदिर',
    },
    hotel: {
      te: 'హోటల్ / వసతి',
      ml: 'താമസ സൗകര്യം / ഹോട്ടൽ',
      ta: 'தங்கும் விடுதி',
      kn: 'ಹೋಟೆಲ್',
      hi: 'होटल / धर्मशाला',
    },
    atm: {
      te: 'ఏటీఎం కేంద్రం',
      ml: 'എടിഎം കൗണ്ടർ',
      ta: 'ஏடிஎம் மையம்',
      kn: 'ಎಟಿಎಂ ಕೇಂದ್ರ',
      hi: 'एटीएम',
    },
  };

  for (const [key, trans] of Object.entries(vocabMap)) {
    if (lower.includes(key)) {
      const translatedWord = trans[targetLang];
      if (translatedWord) {
        if (targetLang === 'ml') return `${translatedWord} എവിടെയാണ്? (Where is the ${key}?)`;
        if (targetLang === 'te') return `${translatedWord} ఎక్కడ ఉంది?`;
        if (targetLang === 'ta') return `${translatedWord} எங்கே உள்ளது?`;
        if (targetLang === 'kn') return `${translatedWord} ಎಲ್ಲಿದೆ?`;
        if (targetLang === 'hi') return `${translatedWord} कहाँ है?`;
      }
    }
  }

  // 3. Simulated realistic translation fallback
  return `[${targetLang.toUpperCase()}] ${trimmed}`;
}

/**
 * Text-to-Speech audio playback using Web Speech API
 */
export function speakTranslatedText(text: string, langCode: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  utterance.lang = langConfig?.speechCode || 'en-IN';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}
