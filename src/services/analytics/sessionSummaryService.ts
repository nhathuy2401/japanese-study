import { callGasApi, getGasBaseUrl } from '../api/gasClient';

export interface SessionSummaryData {
  level: string;
  reviewed: number;
  correct: number;
  durationSeconds: number;
  uidHash?: string;
}

export const sessionSummaryService = {
  async logSessionSummary(data: SessionSummaryData): Promise<void> {
    const url = getGasBaseUrl();
    if (!url) return; // Nếu chưa cấu hình GAS thì bỏ qua nhẹ nhàng, không làm lỗi app

    try {
      await callGasApi(
        '/analytics/session-summary',
        {
          date: new Date().toISOString().split('T')[0],
          level: data.level,
          reviewed: data.reviewed,
          correct: data.correct,
          durationSeconds: data.durationSeconds,
          uidHash: data.uidHash || 'anonymous',
        },
        { timeoutMs: 8_000, retries: 0 }
      );
    } catch (e) {
      // Session summary chỉ là báo cáo phụ, lỗi không được ảnh hưởng luồng học chính
      console.warn('[sessionSummaryService] Không thể gửi session summary:', e);
    }
  },
};

