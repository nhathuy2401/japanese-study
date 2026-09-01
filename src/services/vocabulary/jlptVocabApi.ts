import { z } from 'zod';

export const JLPT_VOCAB_API_URL = 'https://jlpt-vocab-api.vercel.app';

export type JlptLevel = 1 | 2 | 3 | 4 | 5;

const rawVocabularyWordSchema = z
  .object({
    word: z.string().default(''),
    meaning: z.string().default(''),
    furigana: z.string().nullish().default(''),
    romaji: z.string().nullish().default(''),
    level: z.coerce.number().int().min(1).max(5),
  })
  .transform((w) => {
    const trimmedWord = w.word.trim();
    const trimmedFurigana = (w.furigana ?? '').trim();
    return {
      word: trimmedWord,
      meaning: w.meaning.trim(),
      // Với các từ Katakana hoặc Hiragana thuần túy, API trả về furigana: ""
      // Fallback về chính từ đó để giao diện luôn hiển thị cách đọc chuẩn xác
      furigana: trimmedFurigana || trimmedWord,
      romaji: (w.romaji ?? '').trim(),
      level: w.level as JlptLevel,
    };
  });

const vocabularyResponseSchema = z.object({
  total: z.coerce.number().int().nonnegative().default(0),
  offset: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().positive().default(20),
  words: z.array(rawVocabularyWordSchema).default([]),
});

export type VocabularyWord = z.infer<typeof rawVocabularyWordSchema>;

export interface VocabularyResponse {
  total: number;
  offset: number;
  limit: number;
  words: VocabularyWord[];
}

export interface ListVocabularyParams {
  level: JlptLevel;
  offset?: number;
  limit?: number;
  word?: string;
}

export class VocabularyApiError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'VocabularyApiError';
  }
}

async function fetchJson(path: string, timeoutMs = 15_000): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${JLPT_VOCAB_API_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new VocabularyApiError(`Vocabulary API trả về lỗi HTTP ${response.status}.`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof VocabularyApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new VocabularyApiError('Vocabulary API phản hồi quá lâu. Vui lòng thử lại.');
    }
    throw new VocabularyApiError('Không thể kết nối tới Vocabulary API. Kiểm tra kết nối mạng.', error);
  } finally {
    clearTimeout(timeoutId);
  }
}

export const jlptVocabApi = {
  async listWords({
    level,
    offset = 0,
    limit = 20,
    word,
  }: ListVocabularyParams): Promise<VocabularyResponse> {
    const params = new URLSearchParams({
      level: String(level),
      offset: String(offset),
      limit: String(limit),
    });

    if (word?.trim()) params.set('word', word.trim());

    const payload = await fetchJson(`/api/words?${params.toString()}`);
    const parsed = vocabularyResponseSchema.safeParse(payload);

    if (!parsed.success) {
      console.warn('[jlptVocabApi] Schema parse error:', parsed.error);
      throw new VocabularyApiError('Dữ liệu từ Vocabulary API không đúng định dạng mong đợi.');
    }

    return parsed.data;
  },
};
