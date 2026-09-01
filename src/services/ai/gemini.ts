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
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-2.5-pro',
  'gemini-pro',
];

export class GeminiService {
  private activeModelName = 'gemini-2.0-flash';

  async isConfigured(): Promise<boolean> {
    const gasUrl = getGasBaseUrl();
    if (gasUrl && gasUrl.trim().length > 0) return true;
    const key = await getGeminiApiKey();
    return !!key && key.trim().length > 0;
  }

  // Tự động truy vấn danh sách models được kích hoạt cho API key này
  private async resolveWorkingModel(apiKey: string): Promise<string> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        const availableModels: string[] = (data.models || [])
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));

        for (const pref of CANDIDATE_MODELS) {
          if (availableModels.includes(pref)) {
            this.activeModelName = pref;
            return pref;
          }
        }

        if (availableModels.length > 0) {
          this.activeModelName = availableModels[0];
          return availableModels[0];
        }
      }
    } catch (e) {
      console.warn('[GeminiService] Không thể lấy danh sách models động:', e);
    }
    return this.activeModelName;
  }

  async testConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const model = await this.resolveWorkingModel(apiKey);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Ping test. Reply "OK".' }] }],
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        return {
          success: false,
          message: err.error?.message || `Model ${model} trả về lỗi ${response.status}`,
        };
      }

      return {
        success: true,
        message: `Đã kết nối thành công với ${model}! 🎉`,
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi mạng hoặc timeout kết nối' };
    }
  }

  async checkWriting(
    sentence: string,
    targetGrammar: string,
    level: string = 'N5'
  ): Promise<WritingFeedback> {
    const gasUrl = getGasBaseUrl();

    // Ưu tiên gọi qua Google Apps Script Web App (Serverless)
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

    // Fallback: Gọi trực tiếp bằng Gemini API key cá nhân
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Chưa thiết lập URL Google Apps Script hoặc Gemini API key trong Cài đặt');
    }

    const model = await this.resolveWorkingModel(apiKey);

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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n${userPrompt}` }] }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

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

    // Ưu tiên gọi qua Google Apps Script Web App
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

    // Fallback: Gọi trực tiếp bằng Gemini API key cá nhân
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Chưa thiết lập URL Google Apps Script hoặc Gemini API key');
    }

    const model = await this.resolveWorkingModel(apiKey);

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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(rawText) as GrammarExplainResponse;
  }
}

export const geminiService = new GeminiService();
