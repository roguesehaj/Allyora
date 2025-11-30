# Allyora ♡

**Allyora** is a mobile-first menstrual health tracking web application with AI-powered cycle predictions, personalized analytics, health articles, AI chat assistant, and teleconsult booking.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Shadcn UI (Radix UI + Tailwind CSS)
- **Routing**: React Router v6
- **AI**: OpenRouter API (GPT-4o-mini)
- **Storage**: localStorage (ready for backend migration)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```sh
npm install
npm run dev
```

The app will be available at `http://localhost:8080`

## Features

### 1. Personalized Quiz

- 30+ questions with conditional logic
- Single-question-per-screen with progress tracking
- Multiple input types: text, number, date, select, checkbox
- Hindi translations for primary questions

### 2. AI-Powered Dashboard

- Cycle predictions using statistical algorithms (mean, standard deviation)
- Calendar view with confirmed periods, predictions, ovulation, and fertile window
- Health alerts for cycle irregularities
- Analytics: Irregularity Score (0-100) & Symptom Severity Index (0-100)
- Real-time updates when entries are added

### 3. Period Tracking

- Add, view, edit, and delete period entries
- Track flow, pain level, mood, symptoms, and notes
- Calendar integration shows all logged periods

### 4. AI Chat Assistant

- OpenRouter API integration (GPT-4o-mini)
- Context-aware responses about menstrual health
- Conversation history support
- Error handling and graceful fallbacks

### 5. Health Articles

- Curated articles on menstrual health, sleep, fitness, nutrition
- Doctor-submitted articles with approval workflow
- Category filters and article submission system
- 2-minute reads with detailed content

### 6. Teleconsult Booking

- Book consultations with reason and preferred time
- Generates Jitsi meeting URLs
- Booking confirmation with join link

### 7. Partner Connect

- Share cycle data with trusted partners (spouse, family, healthcare providers)
- Granular permissions: view entries, predictions, analytics, quiz data
- Share codes for secure connection
- View shared partner data with permission-based filtering

### 8. Settings & Privacy

- Export user data as JSON
- Delete all data with confirmation
- Privacy policy information
- Local data storage (your data stays on your device)

## Quick Access

On the landing page, you can load pre-seeded sample users:

- **Sample User 1**: Irregular cycles, PCOS, ≥3 period entries
- **Sample User 2**: Regular cycles, 2 period entries
- **Sample User 3**: New user, no entries

## Prediction Algorithm

Located in `src/utils/predict.ts`:

- **predictFromHistory**: Uses ≥3 period entries to calculate mean cycle length, standard deviation, and confidence
- **predictFromQuiz**: Falls back to quiz-based prediction if <3 entries
- **computeIrregularity**: Scores cycle irregularity (0-100) based on quiz responses and cycle variance
- **symptomIndex**: Scores symptom severity (0-100) based on pain, cramps, mood, flow
- **Ovulation & Fertile Window**: Calculates ovulation dates and 6-day fertile windows

## Data Storage

All data is stored in `localStorage` under the key `allyora_data`:

- **users**: Quiz responses with user profiles
- **entries**: Period logs with date, flow, pain, mood, symptoms
- **bookings**: Teleconsult bookings
- **partners**: Partner shares and connections
- **doctorArticles**: Doctor-submitted articles

Sample data is auto-seeded from `src/data/sample_dataset.json` on first load.

## Next Steps for Production

1. **Backend Migration**: Replace localStorage with Supabase or PostgreSQL
2. **Authentication**: Implement Clerk or Supabase Auth
3. **Encryption**: Add data encryption for sensitive health information
4. **Real Teleconsult**: Integrate calendar scheduling and telehealth providers
5. **Testing**: Add unit tests and integration tests
