// src/utils/predict.ts
import type { UserQuiz, Prediction } from '@/types';

export function computeIrregularity(quiz: UserQuiz = {}, entriesStartDates: string[] = []): number {
  let score = 0;
  if (quiz.period_regular === 'no') score += 30;
  if (Array.isArray(quiz.reproductive_conditions) && quiz.reproductive_conditions.includes('PCOS')) score += 25;
  if (quiz.caught_by_surprise === 'yes') score += 10;
  if (quiz.used_apps_before === 'no') score += 5;
  if (quiz.weight_changed === 'yes') score += 10;
  if (typeof quiz.age === 'number' && (quiz.age < 16 || quiz.age > 40)) score += 10;
  
  // Add actual cycle variance if we have entries
  if (entriesStartDates.length >= 3) {
    const dates = entriesStartDates
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (dates.length >= 3) {
      const cycles: number[] = [];
      for (let i = 1; i < dates.length; i++) {
        const cycleLength = Math.round((dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
        if (cycleLength >= 15 && cycleLength <= 60) {
          cycles.push(cycleLength);
        }
      }
      if (cycles.length > 0) {
        const cycleSD = sd(cycles);
        // High cycle variability increases irregularity score
        if (cycleSD > 10) score += 20;
        else if (cycleSD > 7) score += 10;
        else if (cycleSD > 5) score += 5;
      }
    }
  }
  
  return Math.min(100, Math.round(score));
}

export function symptomIndex(quiz: UserQuiz = {}) {
  let idx = 0;
  const pain = Number(quiz.pain || 0); // 0-10
  idx += Math.round((pain / 10) * 40); // scale 0-10 to 0-40
  if (quiz.cramps_before === 'yes') idx += 15;
  if (quiz.mood_swings === 'yes') idx += 10;
  if (quiz.flow_description === 'heavy') idx += 15;
  return Math.min(100, idx);
}

// Helper: compute mean & sd of an array of numbers
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  const s = arr.reduce((a, b) => a + b, 0);
  return s / arr.length;
}

function sd(arr: number[]): number {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  const v = arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length;
  return Math.sqrt(v);
}

// Use history: entries is array of start dates as "YYYY-MM-DD", sorted asc
export function predictFromHistory(entriesStartDates: string[] = [], quiz: UserQuiz = {}): Prediction | null {
  if (!entriesStartDates || entriesStartDates.length < 3) return null;
  
  // Validate and parse dates
  const dates = entriesStartDates
    .map(d => {
      const date = new Date(d);
      return isNaN(date.getTime()) ? null : date;
    })
    .filter((d): d is Date => d !== null);
  
  if (dates.length < 3) return null;
  
  // Calculate cycle lengths
  const cycles: number[] = [];
  for (let i = 1; i < dates.length; i++) {
    const cycleLength = Math.round((dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
    // Validate cycle length (reasonable range: 15-60 days)
    if (cycleLength >= 15 && cycleLength <= 60) {
      cycles.push(cycleLength);
    }
  }
  
  if (cycles.length === 0) return null;
  const mu = Math.round(mean(cycles));
  const sigma = Math.round(sd(cycles));
  const lastStart = dates[dates.length-1];
  const estimatedStart = new Date(lastStart.getTime() + mu*24*60*60*1000);
  
  // Apply tighter range and cap sigma
  const effectiveSigma = Math.min(sigma, 3); // Cap sigma at 3 days for range calculation
  const earliest = new Date(estimatedStart.getTime() - effectiveSigma*0.7*24*60*60*1000); // Reduced multiplier
  const latest = new Date(estimatedStart.getTime() + effectiveSigma*0.7*24*60*60*1000); // Reduced multiplier
  const irr = computeIrregularity(quiz, entriesStartDates);
  
  // Adjusted confidence calculation
  const confidence = Math.max(10, Math.min(95, Math.round(100 - effectiveSigma*4 - irr*0.25)));
  return {
    earliest: earliest.toISOString().slice(0,10),
    latest: latest.toISOString().slice(0,10),
    mean: mu,
    sd: sigma,
    confidence,
    irregularity: irr,
    explanation: `Based on your last ${entriesStartDates.length} cycles, mean ≈ ${mu} days (sd ${sigma}).`
  };
}

// Quiz-driven prediction if history insufficient
export function predictFromQuiz(quiz: UserQuiz = {}, lastStartDate: string | null = null, entriesStartDates: string[] = []): Prediction {
  const baseMean = 28;
  let meanDays = baseMean;
  let sdDays = 2; // Reduced from 3 to 2 for tighter predictions
  const irr = computeIrregularity(quiz, entriesStartDates);
  
  // Tighter ranges even for irregular cycles
  if (irr > 40) sdDays = 4; // Reduced from 7 to 4
  if (Array.isArray(quiz.reproductive_conditions) && quiz.reproductive_conditions.includes('PCOS')) {
    meanDays += 5;
    sdDays += 3; // Reduced from 5 to 3
  }
  if (quiz.weight_changed === 'yes') sdDays += 2; // Reduced from 3 to 2

  // Cap the maximum range to keep predictions tight (max 5 days total = ±2.5 days)
  const maxRange = 2.5;
  sdDays = Math.min(sdDays, maxRange);

  // Validate last start date
  let last: Date;
  if (lastStartDate) {
    const parsedDate = new Date(lastStartDate);
    last = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  } else {
    last = new Date();
  }
  
  const estimatedStart = new Date(last.getTime() + meanDays * 24 * 60 * 60 * 1000);
  const earliest = new Date(estimatedStart.getTime() - sdDays * 24 * 60 * 60 * 1000);
  const latest = new Date(estimatedStart.getTime() + sdDays * 24 * 60 * 60 * 1000);
  
  // Higher confidence with tighter ranges
  const confidence = Math.max(10, Math.min(95, Math.round(100 - sdDays*4 - irr*0.25)));

  return {
    earliest: earliest.toISOString().slice(0,10),
    latest: latest.toISOString().slice(0,10),
    mean: meanDays,
    sd: sdDays,
    confidence,
    irregularity: irr,
    explanation: `Based on your quiz, mean ≈ ${meanDays} days (sd ${sdDays}). Irregularity score ${irr}.`
  };
}

// Health alert detection
export function checkHealthAlert(
  entriesStartDates: string[],
  prediction: Prediction | null
): { shouldAlert: boolean; message: string; severity: 'low' | 'medium' | 'high' } {
  if (!prediction || entriesStartDates.length === 0) {
    return { shouldAlert: false, message: '', severity: 'low' };
  }

  const sortedDates = [...entriesStartDates].sort();
  const mostRecentEntry = sortedDates[sortedDates.length - 1];
  const entryDate = new Date(mostRecentEntry);
  const predEarliest = new Date(prediction.earliest);
  const predLatest = new Date(prediction.latest);

  // Check if actual date is significantly outside predicted range
  const daysBeforeEarliest = Math.round((predEarliest.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysAfterLatest = Math.round((entryDate.getTime() - predLatest.getTime()) / (1000 * 60 * 60 * 24));

  if (daysAfterLatest > 3) {
    return {
      shouldAlert: true,
      message: `Your last period was ${daysAfterLatest} days later than predicted. This significant deviation may indicate cycle irregularity. Consider consulting a healthcare provider if this pattern continues.`,
      severity: daysAfterLatest > 7 ? 'high' : 'medium'
    };
  }

  if (daysBeforeEarliest > 3) {
    return {
      shouldAlert: true,
      message: `Your last period was ${daysBeforeEarliest} days earlier than predicted. This significant deviation may indicate cycle irregularity. Consider consulting a healthcare provider if this pattern continues.`,
      severity: daysBeforeEarliest > 7 ? 'high' : 'medium'
    };
  }

  // Check for high cycle variability
  if (entriesStartDates.length >= 3) {
    const dates = entriesStartDates
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (dates.length >= 3) {
      const cycles: number[] = [];
      for (let i = 1; i < dates.length; i++) {
        const cycleLength = Math.round((dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
        if (cycleLength >= 15 && cycleLength <= 60) {
          cycles.push(cycleLength);
        }
      }
      if (cycles.length > 0) {
        const cycleSD = sd(cycles);
        if (cycleSD > 10) {
          return {
            shouldAlert: true,
            message: `Your cycle length varies significantly (standard deviation: ${Math.round(cycleSD)} days). High variability may indicate an underlying condition. Consider consulting a healthcare provider.`,
            severity: 'high'
          };
        }
      }
    }
  }

  return { shouldAlert: false, message: '', severity: 'low' };
}

// Calculate ovulation date (typically 14 days before next period)
export function calculateOvulation(periodStartDate: string, cycleLength: number): string {
  const periodDate = new Date(periodStartDate);
  const ovulationDate = new Date(periodDate.getTime() + (cycleLength - 14) * 24 * 60 * 60 * 1000);
  return ovulationDate.toISOString().slice(0, 10);
}

// Calculate fertile window (5 days before ovulation + ovulation day = 6 days total)
export function calculateFertileWindow(periodStartDate: string, cycleLength: number): { start: string; end: string } {
  const ovulation = calculateOvulation(periodStartDate, cycleLength);
  const ovulationDate = new Date(ovulation);
  const fertileStart = new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000);
  return {
    start: fertileStart.toISOString().slice(0, 10),
    end: ovulation
  };
}

// Get all ovulation and fertile dates from entries and prediction
export function getOvulationAndFertileDates(
  entriesStartDates: string[],
  prediction: Prediction | null
): { ovulationDates: Set<string>; fertileDates: Set<string> } {
  const ovulationDates = new Set<string>();
  const fertileDates = new Set<string>();

  if (entriesStartDates.length === 0 || !prediction) {
    return { ovulationDates, fertileDates };
  }

  const sortedDates = [...entriesStartDates].sort();
  
  // Calculate for each period
  for (let i = 0; i < sortedDates.length; i++) {
    const periodDate = sortedDates[i];
    let cycleLenForThis = prediction.mean; // Default to mean

    // If there's a next period, use actual cycle length
    if (i + 1 < sortedDates.length) {
      const nextPeriodDate = sortedDates[i + 1];
      const currentCycleLength = Math.round((new Date(nextPeriodDate).getTime() - new Date(periodDate).getTime()) / (1000 * 60 * 60 * 24));
      if (currentCycleLength >= 15 && currentCycleLength <= 60) { // Validate reasonable cycle length
        cycleLenForThis = currentCycleLength;
      }
    } else if (prediction) {
      // For the last recorded period, use the predicted cycle length to estimate next ovulation
      const lastPeriodDateObj = new Date(periodDate);
      const predictedNextPeriodStart = new Date(lastPeriodDateObj.getTime() + prediction.mean * 24 * 60 * 60 * 1000);
      // Only calculate if the predicted next period is in the future or very recent past
      if (predictedNextPeriodStart > new Date(new Date().setDate(new Date().getDate() - 5))) {
        cycleLenForThis = prediction.mean;
      } else {
        continue; // Skip if the last period's cycle is too old to predict future ovulation
      }
    } else {
      continue; // No prediction available for this period
    }

    try {
      const ovulation = calculateOvulation(periodDate, cycleLenForThis);
      const ovulationDate = new Date(ovulation);
      
      const periodDateObj = new Date(periodDate);
      const maxFutureDate = new Date(periodDateObj.getTime() + 35 * 24 * 60 * 60 * 1000); // Ovulation should be within ~35 days of period start
      
      if (ovulationDate >= periodDateObj && ovulationDate <= maxFutureDate) {
        if (!ovulationDates.has(ovulation)) { // Prevent duplicates
          ovulationDates.add(ovulation);

          const fertileWindow = calculateFertileWindow(periodDate, cycleLenForThis);
          const fertileStart = new Date(fertileWindow.start);
          const fertileEnd = new Date(fertileWindow.end);
          
          for (let d = new Date(fertileStart); d <= fertileEnd; d.setDate(d.getDate() + 1)) { // Include ovulation day
            const dateStr = d.toISOString().slice(0, 10);
            if (d >= periodDateObj && dateStr !== ovulation) { // Add to fertile if not ovulation day
              fertileDates.add(dateStr);
            }
          }
        }
      }
    } catch (e) {
      continue;
    }
  }
  return { ovulationDates, fertileDates };
}
