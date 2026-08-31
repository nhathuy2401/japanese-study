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

export class GeminiService {
  private modelName = 'gemini-1.5-flash';

  async isConfigured(): Promise<boolean> {
    const key = await getGeminiApiKey();
    return !!key && key.trim().length > 0;
  }

  async testConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${apiKey}`,
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
        return { success: false, message: err.error?.message || 'Kết nối thất bại' };
      }

      return { success: true, message: 'Kết nối thành công!' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Lỗi mạng hoặc timeout' };
    }
  }

  async checkWriting(
    sentence: string,
    targetGrammar: string,
    level: string = 'N5'
  ): Promise<WritingFeedback> {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Chưa thiết lập Gemini API key trong Cài đặt');
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${apiKey}`,
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
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Chưa thiết lập Gemini API key');
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${apiKey}`,
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

