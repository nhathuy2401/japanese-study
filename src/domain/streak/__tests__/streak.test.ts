import {
  INITIAL_STREAK_STATE,
  getLocalDayKey,
  addLocalDays,
  diffLocalDays,
  recordStudyActivity,
  getDisplayStreak,
  getWeeklyActivity,
  mergeStreakStates,
  StreakState,
} from '../streak';

describe('Streak Domain Logic', () => {
  describe('getLocalDayKey & helpers', () => {
    it('should format date in local YYYY-MM-DD format', () => {
      const sample = new Date(2026, 8, 1, 14, 30); // 2026-09-01
      expect(getLocalDayKey(sample)).toBe('2026-09-01');
    });

    it('should calculate yesterday correctly', () => {
      expect(addLocalDays('2026-09-01', -1)).toBe('2026-08-31');
      expect(addLocalDays('2026-01-01', -1)).toBe('2025-12-31');
    });

    it('should calculate day difference correctly', () => {
      expect(diffLocalDays('2026-09-02', '2026-09-01')).toBe(1);
      expect(diffLocalDays('2026-09-05', '2026-09-01')).toBe(4);
      expect(diffLocalDays('2026-09-01', '2026-09-01')).toBe(0);
    });
  });

  describe('recordStudyActivity', () => {
    it('should start streak at 1 on the first study activity', () => {
      const now = new Date(2026, 8, 1, 10, 0); // 2026-09-01
      const state = recordStudyActivity(INITIAL_STREAK_STATE, now);

      expect(state.currentStreak).toBe(1);
      expect(state.lastStudyDay).toBe('2026-09-01');
      expect(state.activityDays).toEqual(['2026-09-01']);
    });

    it('should be idempotent: 3 activities in same day only count as 1 streak day', () => {
      const morning = new Date(2026, 8, 1, 8, 0);
      const noon = new Date(2026, 8, 1, 12, 0);
      const evening = new Date(2026, 8, 1, 20, 0);

      let state = recordStudyActivity(INITIAL_STREAK_STATE, morning);
      state = recordStudyActivity(state, noon);
      state = recordStudyActivity(state, evening);

      expect(state.currentStreak).toBe(1);
      expect(state.activityDays).toHaveLength(1);
      expect(state.activityDays[0]).toBe('2026-09-01');
    });

    it('should increment streak by 1 when studying on consecutive days', () => {
      const day1 = new Date(2026, 8, 1, 10, 0);
      const day2 = new Date(2026, 8, 2, 11, 0);
      const day3 = new Date(2026, 8, 3, 9, 0);

      let state = recordStudyActivity(INITIAL_STREAK_STATE, day1);
      expect(state.currentStreak).toBe(1);

      state = recordStudyActivity(state, day2);
      expect(state.currentStreak).toBe(2);

      state = recordStudyActivity(state, day3);
      expect(state.currentStreak).toBe(3);
      expect(state.activityDays).toEqual(['2026-09-01', '2026-09-02', '2026-09-03']);
    });

    it('should reset streak to 1 if user skips a day', () => {
      const day1 = new Date(2026, 8, 1, 10, 0);
      // Skip 2026-09-02
      const day3 = new Date(2026, 8, 3, 10, 0);

      let state = recordStudyActivity(INITIAL_STREAK_STATE, day1);
      expect(state.currentStreak).toBe(1);

      state = recordStudyActivity(state, day3);
      expect(state.currentStreak).toBe(1);
      expect(state.lastStudyDay).toBe('2026-09-03');
      expect(state.activityDays).toEqual(['2026-09-01', '2026-09-03']);
    });

    it('should handle midnight transition: 23:59 vs 00:01 as two distinct days', () => {
      const night = new Date(2026, 8, 1, 23, 59, 0);
      const nextMorning = new Date(2026, 8, 2, 0, 1, 0);

      let state = recordStudyActivity(INITIAL_STREAK_STATE, night);
      expect(state.currentStreak).toBe(1);
      expect(state.lastStudyDay).toBe('2026-09-01');

      state = recordStudyActivity(state, nextMorning);
      expect(state.currentStreak).toBe(2);
      expect(state.lastStudyDay).toBe('2026-09-02');
    });
  });

  describe('getDisplayStreak', () => {
    it('should show current streak if user studied today', () => {
      const today = new Date(2026, 8, 2, 15, 0);
      const state: StreakState = {
        currentStreak: 5,
        lastStudyDay: '2026-09-02',
        activityDays: ['2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01', '2026-09-02'],
        updatedAt: today.toISOString(),
      };

      expect(getDisplayStreak(state, today)).toBe(5);
    });

    it('should preserve streak if user studied yesterday and opens app today before studying', () => {
      const today = new Date(2026, 8, 2, 10, 0);
      const state: StreakState = {
        currentStreak: 5,
        lastStudyDay: '2026-09-01', // Yesterday
        activityDays: ['2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01'],
        updatedAt: '2026-09-01T20:00:00.000Z',
      };

      expect(getDisplayStreak(state, today)).toBe(5);
    });

    it('should display 0 if user missed yesterday and opens app today', () => {
      const today = new Date(2026, 8, 3, 10, 0);
      const state: StreakState = {
        currentStreak: 5,
        lastStudyDay: '2026-09-01', // 2 days ago
        activityDays: ['2026-08-28', '2026-08-29', '2026-08-30', '2026-08-31', '2026-09-01'],
        updatedAt: '2026-09-01T20:00:00.000Z',
      };

      expect(getDisplayStreak(state, today)).toBe(0);
    });
  });

  describe('getWeeklyActivity', () => {
    it('should return exactly 7 days with the last one being today', () => {
      const now = new Date(2026, 8, 1, 12, 0); // Tuesday 2026-09-01
      const activityDays = ['2026-08-30', '2026-09-01'];

      const weekly = getWeeklyActivity(activityDays, now);
      expect(weekly).toHaveLength(7);

      // Last item should be today
      const todayItem = weekly[6];
      expect(todayItem.dateKey).toBe('2026-09-01');
      expect(todayItem.isToday).toBe(true);
      expect(todayItem.studied).toBe(true);
      expect(todayItem.day).toBe('T3'); // Tuesday in Vietnamese

      // Day before yesterday (2026-08-30) was studied
      const sundayItem = weekly.find((w) => w.dateKey === '2026-08-30');
      expect(sundayItem?.studied).toBe(true);
      expect(sundayItem?.day).toBe('CN');
    });
  });

  describe('mergeStreakStates', () => {
    it('should union activityDays and recalculate consecutive streak correctly', () => {
      const localState: StreakState = {
        currentStreak: 2,
        lastStudyDay: '2026-09-02',
        activityDays: ['2026-09-01', '2026-09-02'],
        updatedAt: '2026-09-02T10:00:00.000Z',
      };

      const cloudState: StreakState = {
        currentStreak: 1,
        lastStudyDay: '2026-09-03',
        activityDays: ['2026-09-03'],
        updatedAt: '2026-09-03T12:00:00.000Z',
      };

      const merged = mergeStreakStates(localState, cloudState);
      expect(merged.activityDays).toEqual(['2026-09-01', '2026-09-02', '2026-09-03']);
      expect(merged.currentStreak).toBe(3);
      expect(merged.lastStudyDay).toBe('2026-09-03');
    });
  });
});

