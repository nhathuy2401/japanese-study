import { SrsRating, SrsCardData } from '../entities/types';

export interface FsrsScheduleResult {
  nextDueAt: Date;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  intervalDescription: string;
}

export class FsrsEngine {
  // Default parameters based on FSRS-4.5
  private readonly requestRetention = 0.9;
  private readonly maximumInterval = 36500; // 100 years in days

  /**
   * Tính toán tham số SRS kế tiếp và khoảng thời gian ôn tập
   */
  calculateNext(card: SrsCardData, rating: SrsRating, now: Date = new Date()): FsrsScheduleResult {
    let { stability, difficulty, reps, lapses, state } = card;

    if (state === 'new') {
      // First review
      difficulty = this.initDifficulty(rating);
      stability = this.initStability(rating);
      reps = 1;
      lapses = rating === 1 ? 1 : 0;
      state = rating === 1 ? 'learning' : 'review';
    } else {
      // Review or relearning state
      if (rating === 1) {
        // Lapse (Forgotten)
        lapses += 1;
        state = 'relearning';
        stability = Math.max(0.5, stability * 0.4);
        difficulty = Math.min(10, difficulty + 1.2);
      } else {
        // Success (Hard, Good, Easy)
        const factor = rating === 2 ? 1.2 : rating === 3 ? 2.5 : 3.8;
        stability = stability * factor;
        difficulty = Math.max(1, Math.min(10, difficulty + (rating === 2 ? 0.6 : rating === 4 ? -0.6 : 0)));
        state = 'review';
      }
      reps += 1;
    }

    // Calculate days until next review
    let intervalDays = 0;
    if (rating === 1) {
      intervalDays = 10 / (24 * 60); // 10 minutes
    } else {
      intervalDays = Math.max(1, Math.round(stability));
      if (rating === 2 && intervalDays > 1) {
        intervalDays = Math.max(1, Math.round(intervalDays * 0.6));
      }
    }

    const nextDueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
    const intervalDescription = this.formatInterval(intervalDays);

    return {
      nextDueAt,
      stability,
      difficulty,
      reps,
      lapses,
      state,
      intervalDescription,
    };
  }

  /**
   * Dự đoán thời gian cho cả 4 nút đánh giá để hiển thị trên UI
   */
  previewAllIntervals(card: SrsCardData, now: Date = new Date()): Record<SrsRating, string> {
    return {
      1: this.calculateNext(card, 1, now).intervalDescription,
      2: this.calculateNext(card, 2, now).intervalDescription,
      3: this.calculateNext(card, 3, now).intervalDescription,
      4: this.calculateNext(card, 4, now).intervalDescription,
    };
  }

  private initStability(rating: SrsRating): number {
    switch (rating) {
      case 1: return 0.5; // ~10m - 1d
      case 2: return 1.5; // ~1-2 days
      case 3: return 3.5; // ~3-4 days
      case 4: return 7.0; // ~7 days
    }
  }

  private initDifficulty(rating: SrsRating): number {
    switch (rating) {
      case 1: return 7.5;
      case 2: return 6.0;
      case 3: return 4.5;
      case 4: return 2.5;
    }
  }

  private formatInterval(days: number): string {
    if (days < 0.02) {
      return '< 10p';
    }
    if (days < 1) {
      const hours = Math.round(days * 24);
      return `${hours}h`;
    }
    if (days < 30) {
      const d = Math.round(days);
      return `${d} ngày`;
    }
    if (days < 365) {
      const months = Math.round(days / 30);
      return `${months} tháng`;
    }
    const years = (days / 365).toFixed(1);
    return `${years} năm`;
  }
}

export const fsrs = new FsrsEngine();
