import { makeAutoObservable, runInAction } from 'mobx';
import { FuriganaMode } from '../domain/entities/types';
import { ThemeMode, AppTheme, THEMES, getTheme } from '../theme/colors';
import { getGeminiApiKey, saveGeminiApiKey, deleteGeminiApiKey, maskApiKey } from '../services/storage/secureStore';
import { hapticService } from '../services/haptics/hapticService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = 'nihongo-local:theme-mode:v1';
const ROMAJI_STORAGE_KEY = 'nihongo-local:show-romaji:v1';
const FURIGANA_STORAGE_KEY = 'nihongo-local:furigana-mode:v1';

export class SettingsStore {
  // Reading & Display Preferences
  furiganaMode: FuriganaMode = 'tap-to-reveal';
  showRomaji: boolean = false;
  themeMode: ThemeMode = 'dark';
  theme: AppTheme = THEMES.dark;
  hapticsEnabled: boolean = true;
  dailyGoalMinutes: number = 20;

  // Gemini AI Settings
  isAiEnabled: boolean = false;
  geminiApiKey: string = '';
  isAiConfigured: boolean = false;
  allowAiMobileData: boolean = true;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    void this.loadSettings();
  }

  get currentTheme(): AppTheme {
    return this.theme || THEMES[this.themeMode] || THEMES.dark;
  }

  async loadSettings() {
    try {
      const [savedTheme, savedRomaji, savedFurigana] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(ROMAJI_STORAGE_KEY),
        AsyncStorage.getItem(FURIGANA_STORAGE_KEY),
      ]);

      runInAction(() => {
        if (savedTheme === 'light' || savedTheme === 'dark') {
          this.themeMode = savedTheme;
          this.theme = THEMES[savedTheme] || THEMES.dark;
        }
        if (savedRomaji !== null) {
          this.showRomaji = savedRomaji === 'true';
        }
        if (savedFurigana && ['always', 'tap-to-reveal', 'hidden'].includes(savedFurigana)) {
          this.furiganaMode = savedFurigana as FuriganaMode;
        }
      });
    } catch (e) {
      console.warn('[SettingsStore] Lỗi đọc settings:', e);
    }

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
    void AsyncStorage.setItem(FURIGANA_STORAGE_KEY, mode);
  }

  toggleRomaji(val?: boolean) {
    this.showRomaji = val !== undefined ? val : !this.showRomaji;
    hapticService.light();
    void AsyncStorage.setItem(ROMAJI_STORAGE_KEY, String(this.showRomaji));
  }

  setThemeMode(mode: ThemeMode) {
    this.themeMode = mode;
    this.theme = THEMES[mode] || THEMES.dark;
    hapticService.light();
    void AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
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
    hapticService.medium();
  }

  toggleAi(enabled?: boolean) {
    this.isAiEnabled = enabled !== undefined ? enabled : !this.isAiEnabled;
    hapticService.light();
  }

  get maskedApiKey(): string {
    return maskApiKey(this.geminiApiKey);
  }
}
