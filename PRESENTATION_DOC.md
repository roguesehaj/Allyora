# Allyora - Menstrual Health Tracking Web Application
## Comprehensive Documentation for Presentation

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Application Overview](#application-overview)
3. [Core Features](#core-features)
4. [Technical Architecture](#technical-architecture)
5. [User Journey & Workflows](#user-journey--workflows)
6. [Key Components & Pages](#key-components--pages)
7. [Data Models & Algorithms](#data-models--algorithms)
8. [Design System](#design-system)
9. [Technology Stack](#technology-stack)
10. [Current Implementation Status](#current-implementation-status)
11. [Future Enhancements](#future-enhancements)

---

## Executive Summary

**Allyora** is a comprehensive, mobile-first menstrual health tracking web application designed to empower users with personalized cycle predictions, health insights, and access to expert guidance. The application combines data-driven predictions, AI-powered chat assistance, educational content, and teleconsultation booking capabilities into a single, user-friendly platform.

### Key Value Propositions
- **Personalized Predictions**: AI-powered cycle predictions based on user history and quiz responses
- **Comprehensive Tracking**: Detailed period logging with flow, pain, mood, and symptom tracking
- **Health Insights**: Analytics for cycle irregularity and symptom severity
- **Educational Resources**: Curated health articles on menstrual health, sleep, fitness, and nutrition
- **AI Assistant**: Intelligent chat assistant for menstrual health questions
- **Expert Access**: Direct booking for teleconsultations with healthcare professionals
- **Privacy-First**: Local data storage with user control over data export and deletion

---

## Application Overview

### What is Allyora?
Allyora is a web-based menstrual health companion that helps users:
- Track their menstrual cycles and symptoms
- Predict future period dates with statistical confidence
- Understand their cycle patterns through analytics
- Access evidence-based health information
- Get answers to menstrual health questions via AI chat
- Connect with healthcare professionals when needed

### Target Audience
- Women and people with periods of all ages
- Users seeking to understand their menstrual cycles
- Individuals with irregular cycles or reproductive health conditions (e.g., PCOS)
- Users interested in fertility tracking
- People looking for personalized menstrual health guidance

### Platform
- **Type**: Progressive Web Application (PWA-ready)
- **Primary Platform**: Web browser (mobile-first design)
- **Responsive**: Optimized for mobile (375×812 viewport) and desktop
- **Offline Capable**: LocalStorage-based data persistence

---

## Core Features

### 1. Gamified Onboarding Quiz
**Location**: `/quiz`

**Purpose**: Collect comprehensive user data to personalize the experience

**Key Characteristics**:
- **30+ Questions**: Extensive questionnaire covering demographics, cycle history, symptoms, and health conditions
- **Single-Question Flow**: One question per screen for focused user experience
- **Progress Tracking**: Visual progress bar showing completion percentage
- **Conditional Logic**: Questions adapt based on previous answers (e.g., PCOS-related questions only show if condition is indicated)
- **Multiple Input Types**:
  - Number inputs (age, cycle length, period length)
  - Text inputs (name, notes)
  - Date pickers (last period start)
  - Single-select options
  - Multi-select checkboxes
  - Pictorial options (visual flow selection)
- **Bilingual Support**: English with Hindi translations for primary questions
- **Navigation**: Back button, skip option (for non-required questions), required field validation
- **Data Collection**:
  - Demographics (name, age, birth year)
  - Cycle history (regularity, last period, cycle/period length)
  - Symptoms (pain level 0-10, cramps, mood swings, flow description)
  - Health conditions (PCOS, reproductive conditions)
  - Lifestyle factors (weight changes, app usage history)
  - Goals (tracking periods, weight loss, understanding body, etc.)

**Outcome**: Creates user profile and initializes dashboard with personalized predictions

---

### 2. Intelligent Dashboard
**Location**: `/dashboard`

**Purpose**: Central hub displaying cycle predictions, calendar, and health analytics

**Key Components**:

#### A. Period Prediction Card
- **Next Period Window**: Displays earliest and latest predicted dates
- **Confidence Score**: Percentage-based confidence indicator (0-100%)
  - Color-coded badges: Green (≥70%), Yellow (40-69%), Red (<40%)
- **Statistical Explanation**: Shows mean cycle length, standard deviation, and prediction basis
- **Algorithm**: Uses historical data (if ≥3 entries) or quiz responses for prediction

#### B. Interactive Calendar
- **Visual Period Tracking**: 
  - Confirmed period dates (filled droplet icons)
  - Predicted period window (highlighted date range)
  - Ovulation dates (special markers)
  - Fertile window dates (distinct styling)
- **Month Navigation**: Previous/next month controls
- **Date Formatting**: User-friendly date display

#### C. Analytics Tiles
- **Cycle Irregularity Score** (0-100):
  - Calculated from quiz responses and actual cycle variance
  - Factors: Period regularity, PCOS, weight changes, age, cycle variability
  - Visual indicators: "Regular cycles", "Moderate irregularity", "High variability detected"
- **Symptom Severity Index** (0-100):
  - Based on pain level, cramps, mood swings, flow description
  - Recommendations: "Mild symptoms", "Moderate symptoms", "Consider tracking more"

#### D. Health Alerts
- **Smart Notifications**: Detects significant deviations from predicted cycles
- **Severity Levels**: Low, Medium, High
- **Alert Triggers**:
  - Period arriving >3 days early or late
  - High cycle variability (standard deviation >10 days)
  - Pattern irregularities
- **Actionable CTAs**: Direct link to book doctor consultation

#### E. Quick Actions
- **Floating Action Button (FAB)**: Quick access to add period entry
- **Settings Access**: Gear icon for account settings

**Real-time Updates**: Dashboard automatically refreshes when entries are added/edited via event listeners

---

### 3. Period Tracking System
**Location**: `/entries`

**Purpose**: Comprehensive period logging and history management

**Features**:
- **Add Entry Dialog**:
  - Date picker (prevents future dates, max 2 years old)
  - Flow selection: Light, Medium, Heavy
  - Pain level slider: 0-10 scale with visual feedback
  - Notes field: Free-text for additional observations
  - Validation: Prevents duplicate entries on same date
- **Entry List**:
  - Chronological display (newest first)
  - Entry details: Date, flow type, pain level, notes
  - Edit/Delete actions per entry
- **Data Persistence**: All entries saved to localStorage
- **Calendar Integration**: Entries automatically appear on dashboard calendar

**Data Captured**:
- Date (YYYY-MM-DD format)
- Flow intensity
- Pain level (0-10)
- Mood array (extensible)
- Symptoms array (extensible)
- Product used (pad, tampon, etc.)
- Notes (optional)

---

### 4. Health Articles Library
**Location**: `/articles` and `/article/:id`

**Purpose**: Provide evidence-based educational content

**Features**:
- **6 Curated Articles**: Pre-loaded content covering:
  - Menstrual Health
  - Sleep
  - Fitness
  - Nutrition
- **Category Filtering**: Filter by category (All, Menstrual Health, Sleep, Fitness, Nutrition)
- **Article Cards**: 
  - Title, excerpt, category badge
  - Read time estimate (2-minute reads)
  - Author information with credentials
  - Featured images
- **Article Detail View**:
  - Full article content
  - Author details (name, credentials, specialization)
  - Category and read time
  - Back navigation

**Content Structure**:
- Professional author attribution
- Specialized medical credentials
- Readable format optimized for mobile

---

### 5. AI-Powered Chat Assistant
**Location**: `/chat`

**Purpose**: Provide instant answers to menstrual health questions

**Technology**: OpenRouter API integration with GPT-4o-mini model

**Features**:
- **Conversational Interface**: Chat-style UI with user and assistant messages
- **Context Awareness**: Maintains conversation history (last 10 messages)
- **System Prompt**: Specialized menstrual health assistant with:
  - Evidence-based information focus
  - Supportive, non-judgmental tone
  - Encouragement to consult professionals for serious concerns
  - Reference to app features when relevant
- **Error Handling**:
  - API key validation
  - Rate limit detection
  - Credit balance checks
  - Network error handling
  - User-friendly error messages
- **Expert Routing**: Detects keywords (doctor, consult, expert, book) and suggests teleconsult booking
- **Quick Actions**: "Book Doctor Consultation" button always visible

**Topics Covered**:
- Period tracking and predictions
- Menstrual symptoms (cramps, pain, mood swings)
- Cycle irregularities
- PCOS and reproductive conditions
- Fertility and ovulation
- PMS and PMDD
- General menstrual health questions

**Fallback System**: Keyword-based responses if API unavailable (covers: pain, cramps, irregular, PCOS, fertility, spotting, mood, PMS, period, cycle)

---

### 6. Teleconsultation Booking
**Location**: `/book`

**Purpose**: Enable users to book video consultations with healthcare professionals

**Features**:
- **Booking Form**:
  - Reason for consultation (required textarea)
  - Preferred date & time (optional datetime picker)
  - Immediate booking option (if no time specified)
- **Confirmation Screen**:
  - Booking ID display
  - Reason summary
  - Join URL for video call
  - External link button to join Jitsi meeting
- **Integration**: Generates Jitsi Meet room URLs (demo: `https://meet.jit.si/AllyoraDemo_[random]`)
- **Data Storage**: Booking records saved with user association

**Current Implementation**: Demo mode with Jitsi integration
**Production Ready**: Can integrate with Calendly, Zoom, or custom scheduling system

---

### 7. Partner Connect
**Location**: `/partner`

**Purpose**: Allow users to share cycle data with partners (spouses, family, healthcare providers)

**Features**:
- **Connection UI**: Mock interface for partner integration
- **Access Management**: Connect/revoke partner access
- **Use Cases**:
  - Partner awareness of cycle dates
  - Family member support
  - Healthcare provider data sharing

**Current Status**: UI mockup
**Production Ready**: Requires OAuth implementation and API integrations

---

### 8. Settings & Privacy
**Location**: `/settings`

**Purpose**: User data management and privacy controls

**Features**:
- **Data Export**:
  - Download all user data as JSON file
  - Includes: user profile, quiz responses, entries, bookings
  - Filename: `allyora-data-[userId]-[date].json`
- **Data Deletion**:
  - Permanent deletion with confirmation dialog
  - Removes: user account, all entries, all bookings
  - Clears current user session
- **Privacy Information**:
  - Local storage explanation
  - No third-party data sharing promise
  - HIPAA compliance note (for production)
- **Language Settings**: English (with Hindi translations) display

**Privacy Promise**: 
- Data stored locally on device
- No data sold or shared with third parties
- User has full control over data

---

## Technical Architecture

### Application Structure

```
Allyora/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn UI component library (30+ components)
│   │   ├── AnalyticsTile.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Calendar.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── NavLink.tsx
│   │   ├── PredictionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── QuizCard.tsx
│   ├── data/
│   │   ├── articles.ts     # Article content (6 articles)
│   │   └── sample_dataset.json  # Seed data for demo users
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── mockDb.ts       # LocalStorage database layer
│   │   ├── openrouter.ts   # AI chat API integration
│   │   ├── quizQuestions.ts # Quiz question definitions (30+ questions)
│   │   └── utils.ts        # Utility functions (cn, etc.)
│   ├── pages/              # Route pages (10 pages)
│   │   ├── Index.tsx       # Landing page
│   │   ├── Quiz.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Entries.tsx
│   │   ├── Articles.tsx
│   │   ├── ArticleDetail.tsx
│   │   ├── Chat.tsx
│   │   ├── Book.tsx
│   │   ├── Partner.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── utils/
│   │   └── predict.ts      # Prediction algorithms
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and design tokens
├── public/                  # Static assets
│   ├── logo.png
│   ├── favicon.ico
│   └── placeholder.svg
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Routing Structure

**React Router v6** implementation with the following routes:

1. `/` - Landing page (Index)
2. `/quiz` - Onboarding quiz
3. `/dashboard` - Main dashboard
4. `/entries` - Period tracking
5. `/articles` - Articles list
6. `/article/:id` - Article detail
7. `/chat` - AI chat assistant
8. `/book` - Teleconsult booking
9. `/partner` - Partner connect
10. `/settings` - Settings & privacy
11. `*` - 404 Not Found page

### State Management

- **React Hooks**: useState, useEffect, useMemo for component state
- **LocalStorage**: Persistent data storage via `mockDb.ts`
- **Event System**: Custom events (`entriesUpdated`) for cross-component communication
- **React Query**: TanStack Query for data fetching (configured but using localStorage)

### Data Persistence

**LocalStorage-based Mock Database** (`src/lib/mockDb.ts`):

- **Storage Key**: `allyora_data`
- **Data Structure**:
  ```typescript
  {
    users: QuizResponse[],
    entries: Entry[],
    bookings: Booking[],
    doctorArticles: DoctorArticle[]
  }
  ```
- **Operations**:
  - `createUser()` - Create new user from quiz
  - `getUser()` - Retrieve user by ID
  - `getEntries()` - Get all entries for user
  - `addEntry()` - Add period entry
  - `editEntry()` - Update entry
  - `deleteEntry()` - Remove entry
  - `createBooking()` - Create teleconsult booking
  - `exportUserData()` - Export all user data
  - `deleteUserData()` - Delete user and all associated data
- **Error Handling**: StorageError class for quota exceeded and save failures
- **Seed Data**: Auto-seeds from `sample_dataset.json` on first load

---

## User Journey & Workflows

### New User Onboarding Flow

1. **Landing Page** (`/`)
   - User sees Allyora logo and tagline
   - "Begin Quiz" CTA button
   - Quick demo access (if demo users exist)
   - Feature highlights (Track Cycles, Get Predictions, Expert Chat)

2. **Quiz Flow** (`/quiz`)
   - Progress bar shows completion percentage
   - One question per screen
   - Conditional questions appear based on answers
   - Back navigation available
   - Skip option for non-required questions
   - Required field validation
   - Summary screen at completion

3. **Dashboard** (`/dashboard`)
   - Personalized welcome message
   - Initial prediction based on quiz responses
   - Calendar view (may show quiz date as virtual entry)
   - Analytics tiles (may show initial scores)
   - Prompt to add first period entry

### Returning User Flow

1. **Landing Page** (`/`)
   - Option to load existing demo user
   - Or start new quiz

2. **Dashboard** (`/dashboard`)
   - Full prediction based on entry history (if ≥3 entries)
   - Calendar with all logged periods
   - Updated analytics scores
   - Health alerts if irregularities detected

### Period Tracking Workflow

1. **Add Entry**:
   - Click FAB on dashboard or navigate to `/entries`
   - Click "+" button
   - Fill form: Date, Flow, Pain Level, Notes
   - Submit
   - Entry appears in list and on calendar
   - Dashboard updates automatically

2. **Edit Entry**:
   - Navigate to `/entries`
   - Click edit icon on entry
   - Modify fields
   - Save changes
   - Dashboard updates

3. **Delete Entry**:
   - Navigate to `/entries`
   - Click delete icon
   - Confirm deletion
   - Entry removed from list and calendar
   - Dashboard updates

### Chat Assistant Workflow

1. **Access Chat** (`/chat`)
   - Initial greeting message from assistant
   - User types question
   - System processes with OpenRouter API
   - Response displayed
   - Conversation history maintained

2. **Expert Routing**:
   - User mentions "doctor", "consult", "expert", or "book"
   - Assistant suggests teleconsult
   - User clicks "Book Doctor Consultation"
   - Redirects to `/book`

### Teleconsult Booking Workflow

1. **Booking Form** (`/book`)
   - Enter reason for consultation
   - Optionally select preferred date/time
   - Submit booking

2. **Confirmation**:
   - Booking ID displayed
   - Join URL provided
   - "Join Video Call" button
   - Opens Jitsi meeting in new tab

### Article Reading Workflow

1. **Browse Articles** (`/articles`)
   - View all articles or filter by category
   - Click article card

2. **Read Article** (`/article/:id`)
   - Full article content
   - Author information
   - Back navigation

---

## Key Components & Pages

### Core Components

#### 1. QuizCard (`src/components/QuizCard.tsx`)
- Renders individual quiz questions
- Supports all input types (number, text, date, select, multi-select, pictorial, checkbox)
- Handles answer selection and validation
- Displays Hindi translations when available

#### 2. ProgressBar (`src/components/ProgressBar.tsx`)
- Visual progress indicator for quiz
- Percentage-based width
- Smooth animations

#### 3. PredictionCard (`src/components/PredictionCard.tsx`)
- Displays next period prediction window
- Shows earliest and latest dates
- Confidence badge with color coding
- Statistical explanation

#### 4. Calendar (`src/components/Calendar.tsx`)
- Monthly calendar view
- Custom droplet icons for periods
- Highlights predicted dates, ovulation, fertile window
- Month navigation
- Responsive grid layout

#### 5. AnalyticsTile (`src/components/AnalyticsTile.tsx`)
- Displays score (0-100) with visual indicator
- Title and description
- Color-coded based on score ranges

#### 6. ArticleCard (`src/components/ArticleCard.tsx`)
- Article preview card
- Category badge
- Read time
- Click to navigate to detail

#### 7. BottomNav (`src/components/BottomNav.tsx`)
- 5-tab navigation bar
- Icons: Home, Calendar, Articles, Chat, Settings
- Active state indicators
- Fixed at bottom of screen

#### 8. ErrorBoundary (`src/components/ErrorBoundary.tsx`)
- Catches React errors
- Displays user-friendly error message
- Prevents app crash

### Page Components

#### Index Page (`src/pages/Index.tsx`)
- Landing page with logo
- "Begin Quiz" CTA
- Feature highlights
- Demo user quick access

#### Quiz Page (`src/pages/Quiz.tsx`)
- Manages quiz state and navigation
- Conditional question filtering
- Progress tracking
- Summary screen before completion

#### Dashboard Page (`src/pages/Dashboard.tsx`)
- Main hub combining all features
- Loads user data and entries
- Calculates predictions and analytics
- Displays health alerts
- Real-time updates via event listeners

#### Entries Page (`src/pages/Entries.tsx`)
- Entry list with add/edit/delete
- Dialog form for entry creation
- Date validation
- Duplicate prevention

#### Articles Page (`src/pages/Articles.tsx`)
- Article grid/list
- Category filtering
- Navigation to detail pages

#### ArticleDetail Page (`src/pages/ArticleDetail.tsx`)
- Full article content
- Author information
- Back navigation

#### Chat Page (`src/pages/Chat.tsx`)
- Chat interface
- Message history
- Input with send button
- Loading states
- Error handling
- Expert booking CTA

#### Book Page (`src/pages/Book.tsx`)
- Booking form
- Confirmation screen
- Jitsi integration

#### Partner Page (`src/pages/Partner.tsx`)
- Partner connection UI
- Mock implementation

#### Settings Page (`src/pages/Settings.tsx`)
- Data export functionality
- Delete confirmation dialog
- Privacy information
- Language settings

---

## Data Models & Algorithms

### Type Definitions (`src/types/index.ts`)

#### UserQuiz
```typescript
{
  name?: string;
  age?: number;
  birth_year?: number;
  goal?: string[];
  confirmation?: 'yes' | 'no';
  why_not?: string;
  used_apps_before?: 'yes' | 'no';
  track_periods?: 'yes' | 'no';
  period_regular?: 'yes' | 'no';
  caught_by_surprise?: 'yes' | 'no';
  last_period_start?: string;
  cycle_length?: number;
  period_length?: number;
  flow_description?: 'light' | 'medium' | 'heavy';
  pain?: number; // 0-10
  cramps_before?: 'yes' | 'no';
  mood_swings?: 'yes' | 'no';
  reproductive_conditions?: string[];
  weight_changed?: 'yes' | 'no';
}
```

#### Entry
```typescript
{
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  flow: 'light' | 'medium' | 'heavy';
  pain: number; // 0-10
  mood: string[];
  symptoms: string[];
  product: string;
  notes: string;
  created_at: string;
}
```

#### Prediction
```typescript
{
  earliest: string; // YYYY-MM-DD
  latest: string; // YYYY-MM-DD
  mean: number; // Mean cycle length in days
  sd: number; // Standard deviation in days
  confidence: number; // 0-100
  irregularity: number; // 0-100
  explanation: string;
}
```

#### Booking
```typescript
{
  booking_id: string;
  user_id: string;
  reason: string;
  slot: string;
  join_url: string;
  created_at: string;
}
```

### Prediction Algorithms (`src/utils/predict.ts`)

#### 1. predictFromHistory()
**Purpose**: Calculate prediction from actual period entries

**Requirements**: ≥3 period entries

**Algorithm**:
1. Parse and validate entry dates
2. Calculate cycle lengths between consecutive periods (15-60 day range validation)
3. Compute mean (μ) and standard deviation (σ) of cycle lengths
4. Use most recent period date as baseline
5. Calculate estimated next period: `lastStart + μ days`
6. Calculate range: `earliest = estimated - (σ × 0.7)`, `latest = estimated + (σ × 0.7)`
7. Cap sigma at 3 days for tighter predictions
8. Calculate confidence: `100 - (σ × 4) - (irregularity × 0.25)`, clamped to 10-95%

**Output**: Prediction with date range, statistics, and confidence

#### 2. predictFromQuiz()
**Purpose**: Fallback prediction when <3 entries available

**Algorithm**:
1. Start with base mean: 28 days
2. Base standard deviation: 2 days
3. Adjust based on quiz responses:
   - PCOS: +5 days to mean, +3 days to SD
   - Weight changes: +2 days to SD
   - High irregularity (>40): SD = 4 days
4. Cap maximum range at ±2.5 days
5. Use quiz `last_period_start` or current date as baseline
6. Calculate estimated start: `baseline + meanDays`
7. Calculate range: `earliest = estimated - sdDays`, `latest = estimated + sdDays`
8. Calculate confidence: `100 - (sdDays × 4) - (irregularity × 0.25)`, clamped to 10-95%

**Output**: Prediction based on quiz data

#### 3. computeIrregularity()
**Purpose**: Score cycle irregularity (0-100)

**Factors**:
- Period regularity: +30 if irregular
- PCOS: +25
- Caught by surprise: +10
- No app usage before: +5
- Weight changes: +10
- Age extremes (<16 or >40): +10
- Cycle variance (if ≥3 entries):
  - SD >10: +20
  - SD >7: +10
  - SD >5: +5

**Output**: Irregularity score (0-100)

#### 4. symptomIndex()
**Purpose**: Score symptom severity (0-100)

**Factors**:
- Pain level (0-10): Scaled to 0-40
- Cramps before: +15
- Mood swings: +10
- Heavy flow: +15

**Output**: Symptom severity score (0-100)

#### 5. checkHealthAlert()
**Purpose**: Detect significant cycle deviations

**Triggers**:
- Period >3 days late: Medium severity (>7 days: High)
- Period >3 days early: Medium severity (>7 days: High)
- Cycle SD >10 days: High severity

**Output**: Alert object with severity and message

#### 6. getOvulationAndFertileDates()
**Purpose**: Calculate ovulation and fertile window dates

**Algorithm**:
- Ovulation typically 14 days before next period
- Fertile window: 5 days before ovulation + ovulation day (6 days total)
- Calculates for each period entry
- Uses actual cycle length if next period available, otherwise uses predicted mean

**Output**: Sets of ovulation dates and fertile dates

---

## Design System

### Color Palette
- **Primary**: Soft pink (#FF5A8F) - Main brand color
- **Background**: Light pink (#FCEFF2) - App background
- **Secondary**: Muted tones for cards and surfaces
- **Success**: Green for positive indicators
- **Warning**: Yellow/Orange for medium alerts
- **Destructive**: Red for high alerts and errors
- **Muted Foreground**: Gray for secondary text

### Typography
- **Font Family**: Inter (system font fallback)
- **Headings**: Bold, various sizes (text-2xl, text-xl, etc.)
- **Body**: Regular weight, readable sizes
- **Small Text**: text-sm, text-xs for metadata

### Component Styling
- **Border Radius**: 
  - Cards: 20-24px (rounded-2xl, rounded-3xl)
  - Buttons: Full rounded (rounded-full)
  - Inputs: 20-24px (rounded-2xl)
- **Shadows**: Subtle elevation (shadow-lg, shadow-md)
- **Spacing**: Consistent padding and margins (p-4, p-6, space-y-4)
- **Transitions**: Smooth hover and state changes

### Animations
- **Fade In**: `animate-fade-in` for page loads
- **Scale In**: `animate-scale-in` for modals and cards
- **Bounce Subtle**: `animate-bounce-subtle` for logo and icons
- **Spin**: Loading spinners

### Mobile-First Design
- **Viewport**: Optimized for 375×812 (iPhone X)
- **Responsive**: Adapts to larger screens
- **Touch Targets**: Minimum 44×44px for buttons
- **Bottom Navigation**: Fixed at bottom for thumb reach
- **Floating Action Button**: Fixed position for quick access

### UI Component Library
**Shadcn UI** (30+ components):
- Accordion, Alert, Alert Dialog, Avatar, Badge, Breadcrumb
- Button, Calendar, Card, Carousel, Chart, Checkbox
- Collapsible, Command, Context Menu, Dialog, Drawer
- Dropdown Menu, Form, Hover Card, Input, Input OTP
- Label, Menubar, Navigation Menu, Pagination, Popover
- Progress, Radio Group, Resizable, Scroll Area, Select
- Separator, Sheet, Skeleton, Slider, Sonner (Toast)
- Switch, Table, Tabs, Textarea, Toast, Toggle, Tooltip

---

## Technology Stack

### Frontend Framework
- **React 18.3.1**: UI library
- **TypeScript 5.8.3**: Type safety
- **Vite 7.2.4**: Build tool and dev server

### Routing
- **React Router DOM 6.30.1**: Client-side routing

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **CSS Variables**: For theming

### UI Components
- **Shadcn UI**: Component library built on Radix UI
- **Radix UI**: Accessible component primitives (30+ components)
- **Lucide React**: Icon library
- **React Day Picker**: Date picker component

### State Management
- **React Hooks**: useState, useEffect, useMemo
- **TanStack Query 5.83.0**: Data fetching (configured)

### Data Storage
- **LocalStorage API**: Browser storage
- **JSON**: Data serialization

### AI Integration
- **OpenRouter API**: AI model access
- **GPT-4o-mini**: Chat model (via OpenRouter)

### Development Tools
- **ESLint**: Code linting
- **TypeScript ESLint**: TypeScript-specific linting
- **Vite SWC Plugin**: Fast compilation

### Build & Deploy
- **Vite**: Production build
- **Static Assets**: Public folder
- **Environment Variables**: `.env` for API keys

---

## Current Implementation Status

### ✅ Fully Implemented

1. **Onboarding Quiz**
   - 30+ questions with conditional logic
   - Multiple input types
   - Progress tracking
   - Hindi translations
   - Data validation

2. **Dashboard**
   - Period predictions (history and quiz-based)
   - Interactive calendar
   - Analytics tiles
   - Health alerts
   - Real-time updates

3. **Period Tracking**
   - Add/edit/delete entries
   - Date validation
   - Duplicate prevention
   - Calendar integration

4. **Health Articles**
   - 6 curated articles
   - Category filtering
   - Detail view
   - Author attribution

5. **AI Chat Assistant**
   - OpenRouter API integration
   - Conversation history
   - Error handling
   - Expert routing
   - Fallback responses

6. **Teleconsult Booking**
   - Booking form
   - Confirmation screen
   - Jitsi integration
   - Data persistence

7. **Settings & Privacy**
   - Data export (JSON)
   - Data deletion
   - Privacy information

8. **Navigation**
   - Bottom navigation bar
   - Route protection
   - 404 handling

### 🟡 Partially Implemented / Mocked

1. **Partner Connect**
   - UI implemented
   - Backend integration needed (OAuth, API)

2. **Authentication**
   - Guest mode (localStorage user ID)
   - Production needs: Clerk, Supabase Auth, or similar

3. **Database**
   - LocalStorage mock database
   - Production needs: Supabase, PostgreSQL, or similar

4. **Teleconsult Scheduling**
   - Jitsi demo URLs
   - Production needs: Calendly, Zoom, or custom scheduler

### 🔴 Not Implemented

1. **Push Notifications**: For period reminders
2. **Data Sync**: Cloud backup and multi-device sync
3. **Social Features**: Community, sharing
4. **Advanced Analytics**: Charts, trends, reports
5. **Medication Tracking**: Birth control, supplements
6. **Export Formats**: PDF reports, CSV data
7. **Multi-language**: Full Hindi translation
8. **Accessibility**: Screen reader optimization, keyboard navigation

---

## Future Enhancements

### Short-term (MVP+)
1. **Backend Migration**
   - Replace localStorage with Supabase or PostgreSQL
   - Implement Row Level Security (RLS)
   - API endpoints for predictions

2. **Authentication**
   - Implement Clerk or Supabase Auth
   - Email/password or OAuth login
   - Session management

3. **Enhanced Chat**
   - Context-aware responses using user data
   - Integration with cycle predictions
   - Symptom tracking suggestions

4. **Push Notifications**
   - Period prediction reminders
   - Health alert notifications
   - Article recommendations

5. **Data Export Enhancements**
   - PDF reports
   - CSV export for entries
   - Shareable summaries

### Medium-term
1. **Advanced Analytics**
   - Cycle length trends
   - Symptom patterns
   - Flow intensity charts
   - Pain level history

2. **Fertility Features**
   - Ovulation prediction improvements
   - Basal body temperature tracking
   - Cervical mucus tracking
   - Pregnancy mode

3. **Social Features**
   - Partner sharing (real implementation)
   - Healthcare provider access
   - Anonymous community support

4. **Medication Tracking**
   - Birth control reminders
   - Supplement logging
   - Medication effects on cycle

5. **Multi-language Support**
   - Full Hindi translation
   - Additional languages (Spanish, French, etc.)

### Long-term
1. **Machine Learning**
   - Personalized prediction models
   - Symptom pattern recognition
   - Health condition detection

2. **Integration Ecosystem**
   - Apple Health integration
   - Google Fit integration
   - Wearable device sync
   - Other period tracking apps

3. **Telemedicine Platform**
   - Real doctor scheduling
   - Prescription management
   - Medical record integration

4. **Research & Insights**
   - Population-level anonymized insights
   - Research participation opt-in
   - Scientific collaboration

5. **Enterprise Features**
   - Healthcare provider dashboard
   - Clinic integration
   - Insurance partnerships

---

## Key Statistics & Metrics

### Application Metrics
- **Total Pages**: 10 routes
- **Quiz Questions**: 30+ questions
- **UI Components**: 30+ Shadcn components + 8 custom components
- **Articles**: 6 curated health articles
- **Data Models**: 5 main types (UserQuiz, Entry, Prediction, Booking, DoctorArticle)
- **Prediction Algorithms**: 6 core functions
- **Storage**: LocalStorage with JSON serialization

### User Experience Metrics
- **Quiz Completion Time**: ~5-10 minutes (30+ questions)
- **Article Read Time**: 2 minutes average
- **Prediction Confidence**: 10-95% (based on data quality)
- **Analytics Scores**: 0-100 scale for irregularity and symptoms

### Technical Metrics
- **Build Tool**: Vite (fast HMR)
- **Bundle Size**: Optimized with tree-shaking
- **Type Safety**: 100% TypeScript coverage
- **Component Reusability**: High (Shadcn UI base)

---

## Presentation Talking Points

### Opening
- "Allyora is a comprehensive menstrual health companion that combines data science, AI, and user-centered design to empower users with personalized cycle insights."

### Problem Statement
- "Many women struggle to understand their menstrual cycles, leading to surprises, health concerns, and missed opportunities for proactive care."

### Solution
- "Allyora solves this by providing intelligent predictions, comprehensive tracking, educational resources, and direct access to healthcare professionals."

### Key Differentiators
1. **Intelligent Predictions**: Not just calendar-based, but statistically-driven with confidence scores
2. **Comprehensive Onboarding**: 30+ question quiz creates personalized baseline
3. **AI-Powered Assistance**: Instant answers to health questions with expert routing
4. **Privacy-First**: Local data storage with user control
5. **Holistic Approach**: Tracking + Education + Expert Access

### Technical Highlights
- Modern React/TypeScript stack
- Mobile-first responsive design
- LocalStorage for offline capability
- OpenRouter AI integration
- Statistical prediction algorithms

### User Impact
- Predict periods with confidence
- Understand cycle patterns
- Access evidence-based information
- Get expert help when needed
- Maintain privacy and control

### Future Vision
- Cloud sync and multi-device access
- Advanced ML predictions
- Healthcare provider integration
- Research contributions

---

## Conclusion

Allyora represents a comprehensive approach to menstrual health tracking, combining:
- **Data Science**: Statistical prediction algorithms
- **AI Technology**: Intelligent chat assistance
- **User Experience**: Intuitive, mobile-first design
- **Health Education**: Curated articles and insights
- **Expert Access**: Teleconsultation booking
- **Privacy**: Local-first data storage

The application is production-ready in terms of core functionality, with clear paths for backend migration, authentication, and advanced features. The modular architecture allows for incremental enhancements while maintaining a solid user experience foundation.

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Application Version**: Demo Prototype v1.0

