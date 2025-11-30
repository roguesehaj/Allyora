export interface QuizQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  type:
    | "number"
    | "single"
    | "multi"
    | "date"
    | "text"
    | "pictorial"
    | "checkbox";
  options?: Array<{ value: string; label: string; labelHindi?: string }>;
  pictorialOptions?: Array<{ value: string; label: string; image: string }>;
  conditional?: { field: string; value: any };
  required?: boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "name",
    question: "What's your name?",
    questionHindi: "आपका नाम क्या है?",
    type: "text",
    required: true,
  },
  {
    id: "age",
    question: "How old are you?",
    questionHindi: "आपकी उम्र क्या है?",
    type: "number",
    required: true,
  },
  {
    id: "goal",
    question: "What's your main goal using Allyora?",
    questionHindi: "Allyora का उपयोग करने का आपका मुख्य लक्ष्य क्या है?",
    type: "multi",
    options: [
      {
        value: "Track my period",
        label: "Track my period",
        labelHindi: "मेरे पीरियड्स को ट्रैक करें",
      },
      { value: "Lose weight", label: "Lose weight", labelHindi: "वजन कम करना" },
      {
        value: "Understand my body",
        label: "Understand my body",
        labelHindi: "अपने शरीर को समझें",
      },
      {
        value: "Decode my discharge",
        label: "Decode my discharge",
        labelHindi: "मेरे डिस्चार्ज को समझें",
      },
      {
        value: "None of the above",
        label: "None of the above",
        labelHindi: "इनमें से कोई नहीं",
      },
    ],
    required: true,
  },
  {
    id: "period_regular",
    question: "Does your period come regularly?",
    questionHindi: "क्या आपका पीरियड नियमित रूप से आता है?",
    type: "single",
    options: [
      { value: "yes", label: "Yes", labelHindi: "हाँ" },
      { value: "no", label: "No", labelHindi: "नहीं" },
    ],
    required: true,
  },
  {
    id: "know_last_period",
    question: "Do you know when your last period was?",
    questionHindi: "क्या आप जानते हैं कि आपका आखिरी पीरियड कब था?",
    type: "single",
    options: [
      { value: "yes", label: "Yes", labelHindi: "हाँ" },
      { value: "no", label: "No", labelHindi: "नहीं" },
    ],
    required: true,
  },
  {
    id: "last_period_start",
    question: "When did your last period start?",
    questionHindi: "आपका आखिरी पीरियड कब शुरू हुआ था?",
    type: "date",
    conditional: { field: "know_last_period", value: "yes" },
    required: true,
  },
  {
    id: "flow_description",
    question: "How would you describe your menstrual flow?",
    questionHindi: "आप अपने मासिक धर्म प्रवाह का वर्णन कैसे करेंगे?",
    type: "single",
    options: [
      { value: "light", label: "Light", labelHindi: "हल्का" },
      { value: "medium", label: "Medium", labelHindi: "मध्यम" },
      { value: "heavy", label: "Heavy", labelHindi: "भारी" },
    ],
    required: true,
  },
  {
    id: "cramps_before",
    question: "Do you get cramps before your period?",
    questionHindi: "क्या आपको पीरियड से पहले ऐंठन होती है?",
    type: "single",
    options: [
      { value: "yes", label: "Yes", labelHindi: "हाँ" },
      { value: "no", label: "No", labelHindi: "नहीं" },
    ],
    required: true,
  },
  {
    id: "pain",
    question: "On a scale of 0-10, how would you rate your period pain?",
    questionHindi: "0-10 के पैमाने पर, आप अपने पीरियड दर्द को कैसे रेट करेंगे?",
    type: "number",
    required: true,
  },
  {
    id: "reproductive_conditions",
    question: "Do you have any reproductive health conditions?",
    questionHindi: "क्या आपको कोई प्रजनन स्वास्थ्य स्थितियाँ हैं?",
    type: "multi",
    options: [
      { value: "PCOS", label: "PCOS", labelHindi: "पीसीओएस" },
      {
        value: "Endometriosis",
        label: "Endometriosis",
        labelHindi: "एंडोमेट्रियोसिस",
      },
      {
        value: "Severe cramps",
        label: "Severe cramps",
        labelHindi: "गंभीर ऐंठन",
      },
      { value: "PMS", label: "PMS", labelHindi: "पीएमएस" },
      { value: "Other", label: "Other", labelHindi: "अन्य" },
      { value: "None", label: "None", labelHindi: "कोई नहीं" },
    ],
  },
  {
    id: "height",
    question: "What is your height in cm?",
    questionHindi: "सेंटीमीटर में आपकी ऊंचाई क्या है?",
    type: "number",
    required: true,
  },
  {
    id: "weight",
    question: "What is your weight in kg?",
    questionHindi: "किलोग्राम में आपका वजन क्या है?",
    type: "number",
    required: true,
  },
  {
    id: "consent",
    question:
      "I consent to store my period and symptom data for personalized insights. Allyora will not sell your data. You can export or delete data anytime.",
    questionHindi:
      "मैं व्यक्तिगत अंतर्दृष्टि के लिए अपने पीरियड और लक्षण डेटा को संग्रहीत करने के लिए सहमति देता हूं। Allyora आपका डेटा नहीं बेचेगा। यह एक डेमो है - आप किसी भी समय डेटा निर्यात या हटा सकते हैं।",
    type: "checkbox",
    required: true,
  },
];
