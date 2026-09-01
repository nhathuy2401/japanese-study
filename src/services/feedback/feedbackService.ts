import { callGasApi, getGasBaseUrl } from '../api/gasClient';

export type FeedbackCategory = 'bug' | 'feature' | 'content' | 'general';

export interface SendFeedbackParams {
  message: string;
  category?: FeedbackCategory;
}

export const feedbackService = {
  isConfigured(): boolean {
    const url = getGasBaseUrl();
    return !!url && url.trim().length > 0;
  },

  async sendFeedback({ message, category = 'general' }: SendFeedbackParams): Promise<{ ok: boolean; message: string }> {
    if (!message || message.trim().length === 0) {
      throw new Error('Nội dung góp ý không được để trống.');
    }

    return await callGasApi<{ ok: boolean; message: string }>('/feedback', {
      message: message.trim(),
      category,
    });
  },
};

