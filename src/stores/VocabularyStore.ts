import { makeAutoObservable, runInAction } from 'mobx';
import {
  JlptLevel,
  jlptVocabApi,
  VocabularyApiError,
  VocabularyWord,
} from '../services/vocabulary/jlptVocabApi';

export type VocabularyRating = 'again' | 'hard' | 'known';

const DECK_SIZE = 20;

function wordKey(word: VocabularyWord): string {
  return `${word.level}:${word.word}:${word.furigana}`;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

export class VocabularyStore {
  selectedLevel: JlptLevel = 5;
  searchQuery = '';
  activeQuery = '';
  words: VocabularyWord[] = [];
  retryQueue: VocabularyWord[] = [];
  currentIndex = 0;
  totalAvailable = 0;
  pageOffset = 0;
  round = 1;
  isAnswerVisible = false;
  isLoading = false;
  errorMessage: string | null = null;
  studiedCount = 0;
  againCount = 0;
  hardCount = 0;
  knownCount = 0;
  private requestId = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentWord(): VocabularyWord | null {
    return this.words[this.currentIndex] ?? null;
  }

  get progressLabel(): string {
    if (!this.words.length) return '0 / 0';
    return `${Math.min(this.currentIndex + 1, this.words.length)} / ${this.words.length}`;
  }

  get isSessionFinished(): boolean {
    return this.words.length > 0 && this.currentIndex >= this.words.length;
  }

  async initialize() {
    if (this.words.length || this.isLoading) return;
    await this.loadDeck();
  }

  setSearchQuery(value: string) {
    this.searchQuery = value;
  }

  async setLevel(level: JlptLevel) {
    if (level === this.selectedLevel) return;
    this.selectedLevel = level;
    this.searchQuery = '';
    this.activeQuery = '';
    this.pageOffset = 0;
    await this.loadDeck();
  }

  async search() {
    this.activeQuery = this.searchQuery.trim();
    this.pageOffset = 0;
    await this.loadDeck();
  }

  async clearSearch() {
    this.searchQuery = '';
    this.activeQuery = '';
    this.pageOffset = 0;
    await this.loadDeck();
  }

  revealAnswer() {
    this.isAnswerVisible = true;
  }

  rateCurrentWord(rating: VocabularyRating) {
    const word = this.currentWord;
    if (!word || !this.isAnswerVisible) return;

    this.studiedCount += 1;

    if (rating === 'again') {
      this.againCount += 1;
      this.enqueueRetry(word);
    } else if (rating === 'hard') {
      this.hardCount += 1;
      this.enqueueRetry(word);
    } else {
      this.knownCount += 1;
    }

    this.currentIndex += 1;
    this.isAnswerVisible = false;

    if (this.currentIndex >= this.words.length && this.retryQueue.length) {
      this.words = shuffle(this.retryQueue);
      this.retryQueue = [];
      this.currentIndex = 0;
      this.round += 1;
    }
  }

  async loadNextDeck() {
    if (!this.activeQuery && this.totalAvailable > DECK_SIZE) {
      this.pageOffset = (this.pageOffset + DECK_SIZE) % this.totalAvailable;
    }
    await this.loadDeck();
  }

  async retry() {
    await this.loadDeck();
  }

  private enqueueRetry(word: VocabularyWord) {
    if (!this.retryQueue.some((queued) => wordKey(queued) === wordKey(word))) {
      this.retryQueue.push(word);
    }
  }

  private resetSession() {
    this.currentIndex = 0;
    this.retryQueue = [];
    this.round = 1;
    this.isAnswerVisible = false;
    this.studiedCount = 0;
    this.againCount = 0;
    this.hardCount = 0;
    this.knownCount = 0;
  }

  private async loadDeck() {
    const requestId = this.requestId + 1;
    this.requestId = requestId;
    this.isLoading = true;
    this.errorMessage = null;
    this.resetSession();

    try {
      const response = await jlptVocabApi.listWords({
        level: this.selectedLevel,
        offset: this.activeQuery ? 0 : this.pageOffset,
        limit: DECK_SIZE,
        word: this.activeQuery || undefined,
      });

      runInAction(() => {
        if (requestId !== this.requestId) return;
        this.words = shuffle(response.words);
        this.totalAvailable = response.total;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        if (requestId !== this.requestId) return;
        this.words = [];
        this.totalAvailable = 0;
        this.errorMessage = error instanceof VocabularyApiError
          ? error.message
          : 'Không thể tải từ vựng. Hãy thử lại.';
        this.isLoading = false;
      });
    }
  }
}
