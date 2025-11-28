export interface QuizQuestion {
  id: string;
  question: string;
  questionHindi?: string;
  type: 'number' | 'single' | 'multi' | 'date' | 'text' | 'pictorial' | 'checkbox';
  options?: Array<{ value: string; label: string; labelHindi?: string }>;
  pictorialOptions?: Array<{ value: string; label: string; image: string }>;
  conditional?: { field: string; value: any };
  required?: boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'name',
    question: 'What is your name?',
    questionHindi: 'आपका नाम क्या है?',
    type: 'text',
    required: true
  },
  {
    id: 'age',
    question: 'How old are you?',
    questionHindi: 'आपकी उम्र क्या है?',
    type: 'number',
    required: true
  },
  {
    id: 'birth_year',
    question: 'What year were you born?',
    questionHindi: 'आप किस साल में पैदा हुए थे?',
    type: 'number',
    required: true
  },
  {
    id: 'goal',
    question: "What's your main goal using Allyora?",
    questionHindi: 'Allyora का उपयोग करने का आपका मुख्य लक्ष्य क्या है?',
    type: 'multi',
    options: [
      { value: 'Track my period', label: 'Track my period', labelHindi: 'मेरे पीरियड्स को ट्रैक करें' },
      { value: 'Lose weight', label: 'Lose weight', labelHindi: 'वजन कम करना' },
      { value: 'Understand my body', label: 'Understand my body', labelHindi: 'अपने शरीर को समझें' },
      { value: 'Decode my discharge', label: 'Decode my discharge', labelHindi: 'मेरे डिस्चार्ज को समझें' },
      { value: 'None of the above', label: 'None of the above', labelHindi: 'इनमें से कोई नहीं' }
    ],
    required: true
  },
  {
    id: 'confirmation',
    question: 'Do you want to continue?',
    questionHindi: 'क्या आप जारी रखना चाहते हैं?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'why_not',
    question: 'Why not?',
    questionHindi: 'क्यों नहीं?',
    type: 'text',
    conditional: { field: 'confirmation', value: 'no' }
  },
  {
    id: 'used_apps_before',
    question: 'Have you used menstrual tracking apps before?',
    questionHindi: 'क्या आपने पहले मासिक धर्म ट्रैकिंग ऐप्स का उपयोग किया है?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'track_periods',
    question: 'Do you track your periods?',
    questionHindi: 'क्या आप अपने पीरियड्स को ट्रैक करते हैं?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'period_regular',
    question: 'Does your period come regularly?',
    questionHindi: 'क्या आपका पीरियड नियमित रूप से आता है?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'caught_by_surprise',
    question: 'Has your period ever caught you by surprise?',
    questionHindi: 'क्या आपका पीरियड कभी अचानक आया है?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'know_last_period',
    question: 'Do you know when your last period was?',
    questionHindi: 'क्या आप जानते हैं कि आपका आखिरी पीरियड कब था?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'last_period_start',
    question: 'When did your last period start?',
    questionHindi: 'आपका आखिरी पीरियड कब शुरू हुआ था?',
    type: 'date',
    conditional: { field: 'know_last_period', value: 'yes' },
    required: true
  },
  {
    id: 'spotting_outside',
    question: 'Do you get spotting outside your period?',
    questionHindi: 'क्या आपको पीरियड के बाहर स्पॉटिंग होती है?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'period_color',
    question: 'Which color best describes your period?',
    questionHindi: 'कौन सा रंग आपके पीरियड का सबसे अच्छा वर्णन करता है?',
    type: 'single',
    options: [
      { value: 'Bright red', label: 'Bright red', labelHindi: 'चमकीला लाल' },
      { value: 'Dark red', label: 'Dark red', labelHindi: 'गहरा लाल' },
      { value: 'Brown', label: 'Brown', labelHindi: 'भूरा' },
      { value: 'Pink', label: 'Pink', labelHindi: 'गुलाबी' },
      { value: 'Other', label: 'Other', labelHindi: 'अन्य' }
    ],
    required: true
  },
  {
    id: 'consistency',
    question: 'Which picture and word best describe the consistency of your period?',
    questionHindi: 'कौन सी तस्वीर और शब्द आपके पीरियड की स्थिरता का सबसे अच्छा वर्णन करते हैं?',
    type: 'pictorial',
    pictorialOptions: [
      { value: 'smooth', label: 'Smooth', image: '💧' },
      { value: 'clumpy', label: 'Clumpy', image: '🔴' },
      { value: 'watery', label: 'Watery', image: '💦' },
      { value: 'thick', label: 'Thick', image: '🩸' }
    ],
    required: true
  },
  {
    id: 'product',
    question: 'Which period product do you usually use?',
    questionHindi: 'आप आमतौर पर कौन सा पीरियड उत्पाद उपयोग करते हैं?',
    type: 'single',
    options: [
      { value: 'Pad', label: 'Pad', labelHindi: 'पैड' },
      { value: 'Tampon', label: 'Tampon', labelHindi: 'टैम्पोन' },
      { value: 'Cup', label: 'Cup', labelHindi: 'कप' },
      { value: 'Cloth', label: 'Cloth', labelHindi: 'कपड़ा' },
      { value: 'Other', label: 'Other', labelHindi: 'अन्य' }
    ],
    required: true
  },
  {
    id: 'flow_description',
    question: 'How would you describe your menstrual flow?',
    questionHindi: 'आप अपने मासिक धर्म प्रवाह का वर्णन कैसे करेंगे?',
    type: 'single',
    options: [
      { value: 'light', label: 'Light', labelHindi: 'हल्का' },
      { value: 'medium', label: 'Medium', labelHindi: 'मध्यम' },
      { value: 'heavy', label: 'Heavy', labelHindi: 'भारी' }
    ],
    required: true
  },
  {
    id: 'cramps_before',
    question: 'Do you get cramps before your period?',
    questionHindi: 'क्या आपको पीरियड से पहले ऐंठन होती है?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'turn_to',
    question: 'Who are you most likely to turn to with questions about your cycle?',
    questionHindi: 'आप अपने चक्र के बारे में सवालों के साथ किसकी ओर रुख करने की सबसे अधिक संभावना रखते हैं?',
    type: 'single',
    options: [
      { value: 'Mother', label: 'Mother', labelHindi: 'माँ' },
      { value: 'Friend', label: 'Friend', labelHindi: 'दोस्त' },
      { value: 'Partner', label: 'Partner', labelHindi: 'साथी' },
      { value: 'Doctor', label: 'Doctor', labelHindi: 'डॉक्टर' },
      { value: 'Internet', label: 'Internet', labelHindi: 'इंटरनेट' },
      { value: 'No one', label: 'No one', labelHindi: 'कोई नहीं' }
    ],
    required: true
  },
  {
    id: 'cope_symptoms',
    question: 'Is it easy for you to cope with pre-period symptoms?',
    questionHindi: 'क्या आपके लिए पीरियड से पहले के लक्षणों से निपटना आसान है?',
    type: 'single',
    options: [
      { value: 'Easy', label: 'Easy', labelHindi: 'आसान' },
      { value: 'Somewhat', label: 'Somewhat', labelHindi: 'कुछ हद तक' },
      { value: 'Difficult', label: 'Difficult', labelHindi: 'मुश्किल' }
    ],
    required: true
  },
  {
    id: 'mood_swings',
    question: 'Do you experience mood swings during your period?',
    questionHindi: 'क्या आप अपने पीरियड के दौरान मूड स्विंग का अनुभव करते हैं?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'hair_loss',
    question: 'Do you experience hair loss?',
    questionHindi: 'क्या आप बालों के झड़ने का अनुभव करते हैं?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'reproductive_conditions',
    question: 'Do you have any reproductive health conditions?',
    questionHindi: 'क्या आपको कोई प्रजनन स्वास्थ्य स्थितियाँ हैं?',
    type: 'multi',
    options: [
      { value: 'PCOS', label: 'PCOS', labelHindi: 'पीसीओएस' },
      { value: 'Endometriosis', label: 'Endometriosis', labelHindi: 'एंडोमेट्रियोसिस' },
      { value: 'Severe cramps', label: 'Severe cramps', labelHindi: 'गंभीर ऐंठन' },
      { value: 'PMS', label: 'PMS', labelHindi: 'पीएमएस' },
      { value: 'Other', label: 'Other', labelHindi: 'अन्य' },
      { value: 'None', label: 'None', labelHindi: 'कोई नहीं' }
    ]
  },
  {
    id: 'sleep_improve',
    question: 'Is there anything you want to improve about your sleep?',
    questionHindi: 'क्या आप अपनी नींद के बारे में कुछ सुधारना चाहते हैं?',
    type: 'multi',
    options: [
      { value: 'More hours', label: 'More hours', labelHindi: 'अधिक घंटे' },
      { value: 'Less waking', label: 'Less waking', labelHindi: 'कम जागना' },
      { value: 'Better quality', label: 'Better quality', labelHindi: 'बेहतर गुणवत्ता' },
      { value: 'No change', label: 'No change', labelHindi: 'कोई बदलाव नहीं' }
    ]
  },
  {
    id: 'mental_health',
    question: 'Aspects of your mental health you would like to address',
    questionHindi: 'आप अपने मानसिक स्वास्थ्य के कौन से पहलुओं को संबोधित करना चाहेंगे',
    type: 'multi',
    options: [
      { value: 'Anxiety', label: 'Anxiety', labelHindi: 'चिंता' },
      { value: 'Depression', label: 'Depression', labelHindi: 'अवसाद' },
      { value: 'Stress', label: 'Stress', labelHindi: 'तनाव' },
      { value: 'Focus', label: 'Focus', labelHindi: 'ध्यान' },
      { value: 'None', label: 'None', labelHindi: 'कोई नहीं' }
    ]
  },
  {
    id: 'fitness_goal',
    question: 'What is your fitness goal?',
    questionHindi: 'आपका फिटनेस लक्ष्य क्या है?',
    type: 'single',
    options: [
      { value: 'Lose weight', label: 'Lose weight', labelHindi: 'वजन कम करना' },
      { value: 'Maintain', label: 'Maintain', labelHindi: 'बनाए रखना' },
      { value: 'Gain muscle', label: 'Gain muscle', labelHindi: 'मांसपेशियों को बढ़ाना' },
      { value: 'Improve endurance', label: 'Improve endurance', labelHindi: 'सहनशक्ति में सुधार' },
      { value: 'None', label: 'None', labelHindi: 'कोई नहीं' }
    ]
  },
  {
    id: 'height',
    question: 'What is your height in cm?',
    questionHindi: 'सेंटीमीटर में आपकी ऊंचाई क्या है?',
    type: 'number',
    required: true
  },
  {
    id: 'weight',
    question: 'What is your weight in kg?',
    questionHindi: 'किलोग्राम में आपका वजन क्या है?',
    type: 'number',
    required: true
  },
  {
    id: 'weight_changed',
    question: 'Has your weight changed recently?',
    questionHindi: 'क्या हाल ही में आपका वजन बदल गया है?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes', labelHindi: 'हाँ' },
      { value: 'no', label: 'No', labelHindi: 'नहीं' }
    ],
    required: true
  },
  {
    id: 'pain',
    question: 'On a scale of 0-10, how would you rate your period pain?',
    questionHindi: '0-10 के पैमाने पर, आप अपने पीरियड दर्द को कैसे रेट करेंगे?',
    type: 'number',
    required: true
  },
  {
    id: 'consent',
    question: 'I consent to store my period and symptom data for personalized insights. Allyora will not sell your data. This is a demo - you can export or delete data anytime.',
    questionHindi: 'मैं व्यक्तिगत अंतर्दृष्टि के लिए अपने पीरियड और लक्षण डेटा को संग्रहीत करने के लिए सहमति देता हूं। Allyora आपका डेटा नहीं बेचेगा। यह एक डेमो है - आप किसी भी समय डेटा निर्यात या हटा सकते हैं।',
    type: 'checkbox',
    required: true
  }
];
