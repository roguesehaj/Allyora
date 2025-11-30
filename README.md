# Allyora - Menstrual Health Tracking App

**Allyora** is a mobile-first menstrual health tracking web application with AI-powered cycle predictions, personalized analytics, health articles, chat assistant, and teleconsult booking.

## Project Overview

- **Tech Stack**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **Data Storage**: localStorage-based mock database with seed data
- **Routing**: React Router v6
- **State**: React hooks with localStorage persistence

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Features

### ✅ Implemented

1. **Gamified Quiz Flow** (30+ questions)
   - Single-question-per-screen with progress bar
   - Conditional logic, skip options, back navigation
   - Multiple input types: number, text, date, single/multi-select, pictorial, checkbox
   - Hindi translations for primary questions

2. **Dashboard with Predictions**
   - AI-powered cycle predictions using actual prediction algorithms
   - Calendar view with confirmed and predicted dates
   - Analytics tiles: Irregularity Score & Symptom Severity Index
   - Real-time updates when entries are added/edited

3. **Period Tracking**
   - Add, view, and delete period entries
   - Track flow, pain level, mood, symptoms, notes
   - Calendar integration shows all logged periods

4. **Health Articles**
   - 6 curated articles on menstrual health, sleep, fitness, nutrition
   - Category filters
   - 2-minute reads with detailed content

5. **Chat Assistant**
   - Keyword-based canned replies for common questions
   - Topics: pain, cramps, irregular cycles, PCOS, fertility, spotting, mood
   - "Ask Expert" CTA leads to booking

6. **Teleconsult Booking**
   - Book consultation with reason and preferred time
   - Generates Jitsi meeting URL
   - Booking confirmation with join link

7. **Partner Connect**
   - Mock partner integration UI
   - Connect/revoke partner access

8. **Settings & Privacy**
   - Export user data as JSON
   - Delete all data with confirmation
   - Privacy policy information
   - Language selection (English/Hindi)

## Quick Access

On the landing page, you'll see "Quick Access" buttons to load pre-seeded sample users:

- **Sample User 1**: Irregular cycles, PCOS, ≥3 period entries
- **Sample User 2**: Regular cycles, 2 period entries
- **Sample User 3**: New user, no entries

## Data Structure

All data is stored in `localStorage` under the key `allyora_data`. The structure includes:

- **users**: Quiz responses with user profiles
- **entries**: Period logs with date, flow, pain, mood, symptoms
- **bookings**: Teleconsult bookings with Jitsi URLs

Sample data is auto-seeded from `src/data/sample_dataset.json` on first load.

## Prediction Algorithm

Located in `src/utils/predict.ts`:

- **predictFromHistory**: Uses ≥3 period entries to calculate mean cycle length, standard deviation, and confidence
- **predictFromQuiz**: Falls back to quiz-based prediction if <3 entries
- **computeIrregularity**: Scores cycle irregularity (0-100) based on quiz responses
- **symptomIndex**: Scores symptom severity (0-100) based on pain, cramps, mood, flow

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── QuizCard.tsx    # Quiz question renderer
│   ├── ProgressBar.tsx # Progress indicator
│   ├── Calendar.tsx    # Monthly calendar view
│   ├── PredictionCard.tsx
│   ├── AnalyticsTile.tsx
│   ├── ArticleCard.tsx
│   └── BottomNav.tsx   # 5-tab navigation
├── pages/              # Route pages
│   ├── Index.tsx       # Landing page with sample user selection
│   ├── Quiz.tsx        # Full quiz flow
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Entries.tsx     # Period tracking
│   ├── Articles.tsx    # Articles feed
│   ├── ArticleDetail.tsx
│   ├── Chat.tsx        # Chat assistant
│   ├── Book.tsx        # Teleconsult booking
│   ├── Partner.tsx     # Partner connect
│   └── Settings.tsx    # Settings & privacy
├── lib/
│   ├── mockDb.ts       # localStorage database layer
│   └── quizQuestions.ts # Quiz question definitions
├── utils/
│   └── predict.ts      # Prediction algorithms
└── data/
    ├── sample_dataset.json  # Seed data
    └── articles.ts     # Article content
```

## Design System

The app uses a carefully crafted design system with:

- **Colors**: Soft pink palette (#FCEFF2 background, #FF5A8F primary accent)
- **Typography**: Inter font family
- **Components**: 20-24px border radius, subtle shadows, pill-shaped buttons
- **Animations**: Fade-in, scale-in, bounce-subtle for delightful interactions
- **Mobile-first**: Optimized for 375×812 viewport, responsive to desktop

All design tokens are defined in `src/index.css` and `tailwind.config.ts`.

## What's Mocked (for Production)

1. **Authentication**: Currently guest mode; replace with Clerk or Supabase Auth
2. **Database**: localStorage; replace with Supabase or PostgreSQL
3. **Chat LLM**: Canned replies; integrate OpenAI API or similar
4. **Teleconsult**: Jitsi mock URLs; integrate real scheduling (Calendly, etc.)
5. **Partner Integration**: Mock UI; implement OAuth and API integrations

## Next Steps for Production

1. **Backend Setup**
   - Migrate to Supabase or PostgreSQL
   - Set up Row Level Security (RLS) policies
   - Create API endpoints for predictions

2. **Authentication**
   - Implement Clerk or Supabase Auth
   - Add email/password, Google, phone sign-in

3. **AI Integration**
   - Connect chat to OpenAI API for dynamic responses
   - Implement RAG for article-based Q&A

4. **Real Teleconsult**
   - Integrate calendar scheduling
   - Partner with telehealth providers

5. **Analytics & Tracking**
   - Add Mixpanel or Amplitude
   - Track user engagement and health outcomes

## Deployment

This project can be deployed to:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Lovable**: Click "Publish" in the Lovable interface

## Contributing

For production development:
1. Review `notes-for-developer.md` (to be created)
2. Check `api_contracts.md` for backend integration
3. See component specifications in the codebase

## License

Evaluation purposes.

---

**Built with Lovable** ❤️
