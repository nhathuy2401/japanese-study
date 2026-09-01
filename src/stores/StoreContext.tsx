import React, { createContext, useContext } from 'react';
import { RootStore, rootStore } from './RootStore';
import { colors, AppTheme } from '../theme/colors';

const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};

export const useStores = (): RootStore => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};

export const useSettingsStore = () => useStores().settingsStore;
export const useProgressStore = () => useStores().progressStore;
export const useReviewStore = () => useStores().reviewStore;
export const useNotebookStore = () => useStores().notebookStore;
export const useAiStore = () => useStores().aiStore;
export const useVocabularyStore = () => useStores().vocabularyStore;

/**
 * Hook lấy AppTheme hiện tại (Light Mode hoặc Dark Mode) và tự động phản ứng khi đổi theme
 */
export const useAppTheme = (): AppTheme => {
  try {
    const stores = useStores();
    return stores?.settingsStore?.currentTheme || colors.dark;
  } catch {
    return colors.dark;
  }
};
