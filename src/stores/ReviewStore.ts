import { makeAutoObservable } from 'mobx';
import { SrsCardData, SrsRating } from '../domain/entities/types';
import { SEED_SRS_CARDS } from '../db/seed/n5Data';
import { fsrs } from '../domain/srs/fsrs';
import { hapticService } from '../services/haptics/hapticService';
import { sessionSummaryService } from '../services/analytics/sessionSummaryService';
import type { ProgressStore } from './ProgressStore';

interface UndoHistory {
  card: SrsCardData;
  index: number;
}

export class ReviewStore {
  cards: SrsCardData[] = [...SEED_SRS_CARDS];
  currentIndex: number = 0;
  isFlipped: boolean = false;
  undoHistory: UndoHistory | null = null;
  isLoading: boolean = false;
  private progressStore?: ProgressStore;
  private sessionStartTime: number = Date.now();
  private correctCount: number = 0;
  private hasLoggedSummary: boolean = false;
  private hasRecordedStreakThisSession: boolean = false;

  constructor(progressStore?: ProgressStore) {
    this.progressStore = progressStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentCard(): SrsCardData | null {
    if (this.currentIndex >= this.cards.length) return null;
    return this.cards[this.currentIndex];
  }

  get remainingCount(): number {
    return Math.max(0, this.cards.length - this.currentIndex);
  }

  get isSessionFinished(): boolean {
    return this.cards.length > 0 && this.currentIndex >= this.cards.length;
  }

  get projectedIntervals(): Record<SrsRating, string> {
    if (!this.currentCard) {
      return { 1: '', 2: '', 3: '', 4: '' };
    }
    return fsrs.previewAllIntervals(this.currentCard);
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    hapticService.light();
  }

  rateCard(rating: SrsRating) {
    const card = this.currentCard;
    if (!card) return;

    // Ghi nhận streak activity ngay từ lần đánh giá thẻ đầu tiên
    if (!this.hasRecordedStreakThisSession && this.progressStore) {
      this.hasRecordedStreakThisSession = true;
      this.progressStore.recordStudyActivity('srs');
    }

    // Save for undo
    this.undoHistory = {
      card: { ...card },
      index: this.currentIndex,
    };

    if (rating >= 3) {
      this.correctCount += 1;
    }

    // Calculate FSRS update
    const result = fsrs.calculateNext(card, rating);
    card.stability = result.stability;
    card.difficulty = result.difficulty;
    card.reps = result.reps;
    card.lapses = result.lapses;
    card.state = result.state;
    card.dueAt = result.nextDueAt;

    // Trigger haptics based on rating
    if (rating === 1) {
      hapticService.warning();
    } else if (rating === 4) {
      hapticService.success();
    } else {
      hapticService.medium();
    }

    // Move to next card
    this.currentIndex += 1;
    this.isFlipped = false;

    // Check if session finished to log summary once
    if (this.currentIndex >= this.cards.length && !this.hasLoggedSummary) {
      this.hasLoggedSummary = true;
      const durationSeconds = Math.max(1, Math.round((Date.now() - this.sessionStartTime) / 1000));
      void sessionSummaryService.logSessionSummary({
        level: 'N5',
        reviewed: this.cards.length,
        correct: this.correctCount,
        durationSeconds,
      });
    }
  }

  undo() {
    if (!this.undoHistory) return;
    this.currentIndex = this.undoHistory.index;
    this.cards[this.currentIndex] = this.undoHistory.card;
    this.undoHistory = null;
    this.isFlipped = false;
    hapticService.light();
  }

  resetSession() {
    this.cards = [...SEED_SRS_CARDS];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.undoHistory = null;
    this.sessionStartTime = Date.now();
    this.correctCount = 0;
    this.hasLoggedSummary = false;
    this.hasRecordedStreakThisSession = false;
  }
}
