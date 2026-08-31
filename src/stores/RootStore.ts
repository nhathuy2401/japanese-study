import { SettingsStore } from './SettingsStore';
import { ProgressStore } from './ProgressStore';
import { ReviewStore } from './ReviewStore';
import { NotebookStore } from './NotebookStore';
import { AiStore } from './AiStore';
import { VocabularyStore } from './VocabularyStore';

export class RootStore {
  settingsStore: SettingsStore;
  progressStore: ProgressStore;
  reviewStore: ReviewStore;
  notebookStore: NotebookStore;
  aiStore: AiStore;
  vocabularyStore: VocabularyStore;

  constructor() {
    this.settingsStore = new SettingsStore();
    this.progressStore = new ProgressStore();
    this.reviewStore = new ReviewStore();
    this.notebookStore = new NotebookStore();
    this.aiStore = new AiStore();
    this.vocabularyStore = new VocabularyStore();
  }
}

export const rootStore = new RootStore();

