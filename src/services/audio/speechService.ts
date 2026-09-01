import * as Speech from 'expo-speech';

export interface SpeakOptions {
  rate?: number; // 0.5 to 1.5 (Default: 1.0)
  pitch?: number; // 0.5 to 1.5 (Default: 1.0)
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
}

export const speechService = {
  /**
   * Phát âm câu hoặc từ tiếng Nhật với giọng chuẩn Tokyo (ja-JP)
   */
  async speakJapanese(text: string, options: SpeakOptions = {}): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) return;

    try {
      // Dừng âm thanh đang phát trước đó nếu có
      const isCurrentlySpeaking = await Speech.isSpeakingAsync();
      if (isCurrentlySpeaking) {
        await Speech.stop();
      }

      Speech.speak(cleanText, {
        language: 'ja-JP',
        rate: options.rate !== undefined ? options.rate : 1.0,
        pitch: options.pitch !== undefined ? options.pitch : 1.0,
        onStart: () => {
          options.onStart?.();
        },
        onDone: () => {
          options.onDone?.();
        },
        onStopped: () => {
          options.onStopped?.();
        },
        onError: (err) => {
          console.warn('[speechService] Lỗi phát âm thanh:', err);
          options.onError?.(err as Error);
        },
      });
    } catch (err) {
      console.warn('[speechService] Không thể khởi tạo phát âm:', err);
      options.onError?.(err as Error);
    }
  },

  /**
   * Dừng phát âm ngay lập tức
   */
  async stop(): Promise<void> {
    try {
      await Speech.stop();
    } catch (err) {
      console.warn('[speechService] Lỗi khi dừng âm thanh:', err);
    }
  },

  /**
   * Kiểm tra xem hệ thống có đang đọc âm thanh hay không
   */
  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  },

  /**
   * Lấy danh sách giọng đọc tiếng Nhật có sẵn trên thiết bị
   */
  async getJapaneseVoices(): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.filter((v) => v.language.startsWith('ja'));
    } catch {
      return [];
    }
  },
};

