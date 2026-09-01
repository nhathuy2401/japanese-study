import { callGasApi, getGasBaseUrl } from '../api/gasClient';
import { getGeminiApiKey } from '../storage/secureStore';

export interface WritingFeedback {
  isGrammaticallyValid: boolean;
  correctedSentence: string;
  naturalAlternative?: string;
  explanationVi: string;
  grammarPoints: string[];
  caution?: string;
}

export interface GrammarExplainResponse {
  simpleExplanationVi: string;
  practicalNuance: string;
  examples: {
    japanese: string;
    reading: string;
    meaningVi: string;
  }[];
}

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-pro',
];

export class GeminiService {
  private activeModelName = 'gemini-3.6-flash';

  async isConfigured(): Promise<boolean> {
    const gasUrl = getGasBaseUrl();
    if (gasUrl && gasUrl.trim().length > 0) return true;
    const key = await getGeminiApiKey();
    return !!key && key.trim().length > 0;
  }

  // Tự động thử qua danh sách models và ghi nhớ model hoạt động thành công
  private async executeWithFallback(
    apiKey: string,
    bodyFactory: () => Record<string, any>
  ): Promise<{ response: Response; model: string }> {
    const modelsToTry = [
      this.activeModelName,
      ...CANDIDATE_MODELS.filter((m) => m !== this.activeModelName),
    ];

    let lastErrorMsg = '';

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyFactory()),
          }
        );

        if (response.ok) {
          this.activeModelName = model;
          return { response, model };
        }

        const errData = await response.json().catch(() => ({}));
        const message: string = errData.error?.message || `HTTP ${response.status}`;
        lastErrorMsg = message;

        // Nếu Google trả về tên model gợi ý trong message (ví dụ gemini-3.6-flash)
        const match = message.match(/models\/(gemini-[\w\.-]+)/);
        if (match && match[1] && match[1] !== model) {
          const suggestedModel = match[1];
          const directRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${suggestedModel}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyFactory()),
            }
          );
          if (directRes.ok) {
            this.activeModelName = suggestedModel;
            return { response: directRes, model: suggestedModel };
          }
        }
      } catch (e: any) {
        lastErrorMsg = e.message;
      }
    }

    throw new Error(lastErrorMsg || 'Không thể kết nối đến model Gemini.');
  }

  async testConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const { model } = await this.executeWithFallback(apiKey, () => ({
        contents: [{ parts: [{ text: 'Ping test. Reply "OK".' }] }],
      }));

      return {
        success: true,
        message: `Đã kết nối thành công với ${model}! 🎉`,
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi kết nối Gemini API' };
    }
  }

  async checkWriting(
    sentence: string,
    targetGrammar: string,
    level: string = 'N5'
  ): Promise<WritingFeedback> {
    const gasUrl = getGasBaseUrl();

    // 1. Ưu tiên gọi qua Google Apps Script Web App (Serverless)
    if (gasUrl) {
      try {
        return await callGasApi<WritingFeedback>('/ai/writing-feedback', {
          sentence,
          targetGrammar,
          level,
        });
      } catch (gasError) {
        console.warn('[GeminiService] GAS writing-feedback failed, trying local key fallback if available:', gasError);
        const localKey = await getGeminiApiKey();
        if (!localKey) throw gasError;
      }
    }

    // 2. Fallback: Gọi trực tiếp bằng Gemini API key cá nhân với auto-fallback
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Chưa thiết lập URL Google Apps Script hoặc Gemini API key trong Cài đặt');
    }

    const systemPrompt = `
Bạn là trợ giảng tiếng Nhật cho người Việt ở trình độ ${level}.
Hãy đánh giá câu của người học theo đúng ngữ cảnh và trả về đúng định dạng JSON:
{
  "isGrammaticallyValid": boolean,
  "correctedSentence": "string",
  "naturalAlternative": "string",
  "explanationVi": "string giải thích ngắn bằng tiếng Việt",
  "grammarPoints": ["mẫu 1", "mẫu 2"],
  "caution": "string chú ý nếu có"
}
`;

    const userPrompt = `
Mục tiêu ngữ pháp: ${targetGrammar}
Câu của người học: "${sentence}"
`;

    const { response } = await this.executeWithFallback(apiKey, () => ({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n${userPrompt}` }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }));

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Không nhận được phản hồi từ AI');

    try {
      return JSON.parse(rawText) as WritingFeedback;
    } catch {
      throw new Error('Không thể phân tích dữ liệu JSON từ AI');
    }
  }

  async explainGrammar(pattern: string, currentLevel: string): Promise<GrammarExplainResponse> {
    const gasUrl = getGasBaseUrl();

    // 1. Ưu tiên gọi qua Google Apps Script Web App
    if (gasUrl) {
      try {
        return await callGasApi<GrammarExplainResponse>('/ai/grammar-explanation', {
          pattern,
          level: currentLevel,
        });
      } catch (gasError) {
        console.warn('[GeminiService] GAS grammar-explanation failed, trying local key fallback if available:', gasError);
        const localKey = await getGeminiApiKey();
        if (!localKey) throw gasError;
      }
    }

    // 2. Fallback: Gọi trực tiếp bằng Gemini API key cá nhân với auto-fallback
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Chưa thiết lập URL Google Apps Script hoặc Gemini API key');
    }

    const prompt = `
Hãy giải thích mẫu ngữ pháp "${pattern}" (${currentLevel}) cho người Việt theo phong cách siêu dễ hiểu, trực quan.
Trả về JSON đúng format:
{
  "simpleExplanationVi": "giải thích ngắn",
  "practicalNuance": "sắc thái đời sống",
  "examples": [
    {"japanese": "...", "reading": "...", "meaningVi": "..."}
  ]
}
`;

    const { response } = await this.executeWithFallback(apiKey, () => ({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }));

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(rawText) as GrammarExplainResponse;
  }
}

export const geminiService = new GeminiService();
