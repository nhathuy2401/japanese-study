/**
 * Streak Domain Logic for Nihongo Local
 * 
 * Rules:
 * - 1 streak day is counted if learner has at least 1 valid study activity in local day.
 * - Idempotent: Multiple activities in the same day do not increase streak multiple times.
 * - local day key: YYYY-MM-DD based on user's device local timezone (NOT UTC).
 * - Last study day is today or yesterday -> display currentStreak.
 * - Last study day is older than yesterday -> display 0 (broken streak).
 */

export interface StreakState {
  currentStreak: number;
  lastStudyDay: string | null; // YYYY-MM-DD (local timezone)
  activityDays: string[];      // List of unique active days, max 365 days
  updatedAt: string;           // ISO 8601 string
}

export const INITIAL_STREAK_STATE: StreakState = {
  currentStreak: 0,
  lastStudyDay: null,
  activityDays: [],
  updatedAt: new Date().toISOString(),
};

/**
 * Returns date in YYYY-MM-DD format using the device's local timezone.
 */
export function getLocalDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds offset days to a given day key (or Date) in local timezone.
 */
export function addLocalDays(dateOrKey: Date | string, offsetDays: number): string {
  let date: Date;
  if (typeof dateOrKey === 'string') {
    const [year, month, day] = dateOrKey.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateOrKey.getTime());
  }
  date.setDate(date.getDate() + offsetDays);
  return getLocalDayKey(date);
}

/**
 * Calculates day difference between two YYYY-MM-DD keys (dayKeyA - dayKeyB).
 */
export function diffLocalDays(dayKeyA: string, dayKeyB: string): number {
  const [yA, mA, dA] = dayKeyA.split('-').map(Number);
  const [yB, mB, dB] = dayKeyB.split('-').map(Number);
  const dateA = new Date(yA, mA - 1, dA);
  const dateB = new Date(yB, mB - 1, dB);
  const diffTime = dateA.getTime() - dateB.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Records a study activity and computes updated StreakState.
 */
export function recordStudyActivity(
  state: StreakState,
  now: Date = new Date()
): StreakState {
  const today = getLocalDayKey(now);

  // Idempotent: If user already studied today, do not increment streak again
  if (state.lastStudyDay === today) {
    const hasToday = state.activityDays.includes(today);
    return {
      ...state,
      activityDays: hasToday ? state.activityDays : [...state.activityDays, today],
      updatedAt: now.toISOString(),
    };
  }

  const yesterday = addLocalDays(today, -1);
  let newStreak = 1;

  if (state.lastStudyDay === yesterday) {
    // Studied yesterday -> streak continues (+1)
    newStreak = state.currentStreak + 1;
  } else {
    // Skipped 1+ days -> streak resets to 1
    newStreak = 1;
  }

  const newActivityDays = state.activityDays.includes(today)
    ? state.activityDays
    : [...state.activityDays, today];

  // Sort and keep only the latest 365 days
  newActivityDays.sort();
  const trimmedActivityDays = newActivityDays.slice(-365);

  return {
    currentStreak: newStreak,
    lastStudyDay: today,
    activityDays: trimmedActivityDays,
    updatedAt: now.toISOString(),
  };
}

/**
 * Returns streak number to display on UI.
 * If user missed yesterday, displays 0 (broken streak) without requiring a cron job.
 */
export function getDisplayStreak(state: StreakState, now: Date = new Date()): number {
  if (!state.lastStudyDay) return 0;

  const today = getLocalDayKey(now);
  const yesterday = addLocalDays(today, -1);

  if (state.lastStudyDay === today || state.lastStudyDay === yesterday) {
    return state.currentStreak;
  }

  return 0;
}

export interface WeeklyDayActivity {
  day: string;       // T2, T3, T4, T5, T6, T7, CN
  dateKey: string;   // YYYY-MM-DD
  studied: boolean;  // true if user studied on this day
  isToday: boolean;  // true if this slot is today
}

const VIETNAMESE_WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * Generates 7-day activity array ending today.
 */
export function getWeeklyActivity(
  activityDays: string[],
  now: Date = new Date()
): WeeklyDayActivity[] {
  const result: WeeklyDayActivity[] = [];
  const today = getLocalDayKey(now);

  for (let offset = -6; offset <= 0; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const dateKey = getLocalDayKey(date);
    const dayOfWeekIndex = date.getDay(); // 0 = CN, 1 = T2, ...
    const dayLabel = VIETNAMESE_WEEKDAYS[dayOfWeekIndex];

    result.push({
      day: dayLabel,
      dateKey,
      studied: activityDays.includes(dateKey),
      isToday: dateKey === today,
    });
  }

  return result;
}

/**
 * Merges local and cloud streak states (union of activity days, recalculating true streak).
 */
export function mergeStreakStates(
  localState: StreakState,
  cloudState: StreakState,
  now: Date = new Date()
): StreakState {
  const uniqueDays = Array.from(
    new Set([...localState.activityDays, ...cloudState.activityDays])
  ).sort();

  if (uniqueDays.length === 0) {
    return { ...INITIAL_STREAK_STATE, updatedAt: now.toISOString() };
  }

  const latestDay = uniqueDays[uniqueDays.length - 1];

  // Recalculate consecutive streak ending at latestDay
  let computedStreak = 1;
  for (let i = uniqueDays.length - 1; i > 0; i -= 1) {
    const current = uniqueDays[i];
    const prev = uniqueDays[i - 1];
    if (diffLocalDays(current, prev) === 1) {
      computedStreak += 1;
    } else {
      break;
    }
  }

  return {
    currentStreak: computedStreak,
    lastStudyDay: latestDay,
    activityDays: uniqueDays.slice(-365),
    updatedAt: new Date(
      Math.max(
        new Date(localState.updatedAt || 0).getTime(),
        new Date(cloudState.updatedAt || 0).getTime()
      )
    ).toISOString(),
  };
}

