import * as SecureStore from 'expo-secure-store';

const GEMINI_API_KEY_STORAGE = 'nihongo_local_gemini_key';

export async function saveGeminiApiKey(apiKey: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(GEMINI_API_KEY_STORAGE, apiKey.trim());
    return true;
  } catch (error) {
    console.warn('[SecureStore] Failed to save Gemini key:', error);
    return false;
  }
}

export async function getGeminiApiKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(GEMINI_API_KEY_STORAGE);
  } catch (error) {
    console.warn('[SecureStore] Failed to get Gemini key:', error);
    return null;
  }
}

export async function deleteGeminiApiKey(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(GEMINI_API_KEY_STORAGE);
    return true;
  } catch (error) {
    console.warn('[SecureStore] Failed to delete Gemini key:', error);
    return false;
  }
}

export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return '••••••••';
  return `••••••••${apiKey.slice(-4)}`;
}

