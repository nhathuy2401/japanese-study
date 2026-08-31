import { z } from 'zod';

export const JLPT_VOCAB_API_URL = 'https://jlpt-vocab-api.vercel.app';

export type JlptLevel = 1 | 2 | 3 | 4 | 5;

const vocabularyWordSchema = z.object({
  word: z.string().min(1),
  meaning: z.string().min(1),
  furigana: z.string().min(1),
  romaji: z.string().min(1),
  level: z.number().int().min(1).max(5),
});

const vocabularyResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  words: z.array(vocabularyWordSchema),
});

export type VocabularyWord = z.infer<typeof vocabularyWordSchema>;

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

async function fetchJson(path: string, timeoutMs = 12_000): Promise<unknown> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${JLPT_VOCAB_API_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new VocabularyApiError(`Vocabulary API trả về lỗi ${response.status}.`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof VocabularyApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new VocabularyApiError('Vocabulary API phản hồi quá lâu. Hãy thử lại.');
    }
    throw new VocabularyApiError('Không thể kết nối Vocabulary API.', error);
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
      throw new VocabularyApiError('Dữ liệu từ Vocabulary API không đúng định dạng mong đợi.');
    }

    return parsed.data;
  },
};

