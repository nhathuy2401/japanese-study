import { makeAutoObservable, runInAction } from 'mobx';
import { FuriganaMode } from '../domain/entities/types';
import { ThemeMode } from '../theme/colors';
import { getGeminiApiKey, saveGeminiApiKey, deleteGeminiApiKey, maskApiKey } from '../services/storage/secureStore';
import { hapticService } from '../services/haptics/hapticService';

export class SettingsStore {
  // Reading & Display Preferences
  furiganaMode: FuriganaMode = 'tap-to-reveal';
  showRomaji: boolean = false;
  themeMode: ThemeMode = 'dark';
  hapticsEnabled: boolean = true;
  dailyGoalMinutes: number = 20;

  // Gemini AI Settings
  isAiEnabled: boolean = false;
  geminiApiKey: string = '';
  isAiConfigured: boolean = false;
  allowAiMobileData: boolean = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadSettings();
  }

  async loadSettings() {
    const key = await getGeminiApiKey();
    runInAction(() => {
      if (key) {
        this.geminiApiKey = key;
        this.isAiConfigured = true;
        this.isAiEnabled = true;
      }
    });
  }

  setFuriganaMode(mode: FuriganaMode) {
    this.furiganaMode = mode;
    hapticService.light();
  }

  toggleRomaji(val?: boolean) {
    this.showRomaji = val !== undefined ? val : !this.showRomaji;
    hapticService.light();
  }

  setThemeMode(mode: ThemeMode) {
    this.themeMode = mode;
    hapticService.light();
  }

  setHapticsEnabled(val: boolean) {
    this.hapticsEnabled = val;
    hapticService.setEnabled(val);
  }

  setDailyGoalMinutes(minutes: number) {
    this.dailyGoalMinutes = minutes;
  }

  async setGeminiKey(apiKey: string) {
    const trimmed = apiKey.trim();
    if (trimmed.length > 0) {
      await saveGeminiApiKey(trimmed);
      runInAction(() => {
        this.geminiApiKey = trimmed;
        this.isAiConfigured = true;
        this.isAiEnabled = true;
      });
      hapticService.success();
    }
  }

  async removeGeminiKey() {
    await deleteGeminiApiKey();
    runInAction(() => {
      this.geminiApiKey = '';
      this.isAiConfigured = false;
      this.isAiEnabled = false;
    });
    hapticService.warning();
  }

  toggleAi(val: boolean) {
    this.isAiEnabled = val;
  }

  get maskedApiKey(): string {
    return maskApiKey(this.geminiApiKey);
  }
}

