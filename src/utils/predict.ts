// src/utils/predict.ts
export function computeIrregularity(quiz: any = {}) {
  let score = 0;
  if (quiz.period_regular === 'no') score += 30;
  if (Array.isArray(quiz.reproductive_conditions) && quiz.reproductive_conditions.includes('PCOS')) score += 25;
  if (quiz.caught_by_surprise === 'yes') score += 10;
  if (quiz.used_apps_before === 'no') score += 5;
  if (quiz.weight_changed === 'yes') score += 10;
  if (typeof quiz.age === 'number' && (quiz.age < 16 || quiz.age > 40)) score += 10;
  return Math.min(100, Math.round(score));
}

export function symptomIndex(quiz: any = {}) {
  let idx = 0;
  const pain = Number(quiz.pain || 0); // 0-10
  idx += Math.round((pain / 10) * 40); // scale 0-10 to 0-40
  if (quiz.cramps_before === 'yes') idx += 15;
  if (quiz.mood_swings === 'yes') idx += 10;
  if (quiz.flow_description === 'heavy') idx += 15;
  return Math.min(100, idx);
}

// Helper: compute mean & sd of an array of numbers
function mean(arr: number[]){
  const s = arr.reduce((a,b)=>a+b,0); return s/arr.length;
}
function sd(arr: number[]){
  const m = mean(arr);
  const v = arr.reduce((a,b)=>a+Math.pow(b-m,2),0)/arr.length;
  return Math.sqrt(v);
}

// Use history: entries is array of start dates as "YYYY-MM-DD", sorted asc
export function predictFromHistory(entriesStartDates: string[] = [], quiz: any = {}) {
  if (!entriesStartDates || entriesStartDates.length < 3) return null;
  const dates = entriesStartDates.map(d => new Date(d));
  const cycles = [];
  for (let i=1;i<dates.length;i++){
    cycles.push(Math.round((dates[i].getTime()-dates[i-1].getTime())/(1000*60*60*24)));
  }
  const mu = Math.round(mean(cycles));
  const sigma = Math.round(sd(cycles));
  const lastStart = dates[dates.length-1];
  const estimatedStart = new Date(lastStart.getTime() + mu*24*60*60*1000);
  const earliest = new Date(estimatedStart.getTime() - sigma*24*60*60*1000);
  const latest = new Date(estimatedStart.getTime() + sigma*24*60*60*1000);
  const irr = computeIrregularity(quiz);
  const confidence = Math.max(10, Math.min(95, Math.round(100 - sigma*6 - irr*0.4)));
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
export function predictFromQuiz(quiz: any = {}, lastStartDate: string | null = null) {
  const baseMean = 28;
  let meanDays = baseMean;
  let sdDays = 3;
  const irr = computeIrregularity(quiz);
  if (irr > 40) sdDays = 7;
  if (Array.isArray(quiz.reproductive_conditions) && quiz.reproductive_conditions.includes('PCOS')) {
    meanDays += 5;
    sdDays += 5;
  }
  if (quiz.weight_changed === 'yes') sdDays += 3;

  const last = lastStartDate ? new Date(lastStartDate) : new Date();
  const estimatedStart = new Date(last.getTime() + meanDays*24*60*60*1000);
  const earliest = new Date(estimatedStart.getTime() - sdDays*24*60*60*1000);
  const latest = new Date(estimatedStart.getTime() + sdDays*24*60*60*1000);
  const confidence = Math.max(10, Math.min(95, Math.round(100 - sdDays*6 - irr*0.4)));

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
