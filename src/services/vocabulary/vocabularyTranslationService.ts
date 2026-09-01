import AsyncStorage from '@react-native-async-storage/async-storage';
import { callGasApi, getGasBaseUrl } from '../api/gasClient';
import type { VocabularyWord } from './jlptVocabApi';

const TRANSLATION_CACHE_KEY = 'nihongo-local:vocabulary-translations:v1';
const MAX_WORDS_PER_REQUEST = 20;

type TranslationCache = Record<string, string>;

interface VocabularyTranslationResponse {
  translations?: Array<{
    id?: string;
    meaningVi?: string;
  }>;
}

// Nạp từ điển Việt Sub cục bộ (Prebundled 8,385 từ vựng JLPT N5 - N1)
let PREBUNDLED_SUBTITLES: Record<string, string> = {};
try {
  PREBUNDLED_SUBTITLES = require('../../data/generated/vocabulary_viet_sub.json');
} catch (e) {
  // Dự phòng nếu chưa sinh file bundle
  PREBUNDLED_SUBTITLES = {};
}

function cacheId(word: VocabularyWord): string {
  return [word.word, word.furigana, word.meaning].join('\u0001');
}

function cleanTranslation(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const translation = value.trim();
  return translation ? translation : null;
}

/**
 * Tìm kiếm nghĩa Việt Sub từ kho dữ liệu tĩnh offline (0ms latency)
 */
export function getPrebundledSubtitle(word: VocabularyWord): string | null {
  const byFullId = PREBUNDLED_SUBTITLES[cacheId(word)];
  if (byFullId) return byFullId;

  const byWord = PREBUNDLED_SUBTITLES[word.word];
  if (byWord) return byWord;

  if (word.furigana && PREBUNDLED_SUBTITLES[word.furigana]) {
    return PREBUNDLED_SUBTITLES[word.furigana];
  }

  return null;
}

async function readCache(): Promise<TranslationCache> {
  try {
    const raw = await AsyncStorage.getItem(TRANSLATION_CACHE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => typeof value === 'string' && value.trim().length > 0),
    );
  } catch (error) {
    console.warn('[vocabularyTranslation] Không thể đọc cache bản dịch:', error);
    return {};
  }
}

async function saveCache(cache: TranslationCache): Promise<void> {
  try {
    await AsyncStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('[vocabularyTranslation] Không thể lưu cache bản dịch:', error);
  }
}

/**
 * Gắn nghĩa Việt Sub (Thuần Việt) cho danh sách thẻ từ vựng.
 * Ưu tiên:
 * 1. Kho Việt Sub có sẵn offline (8,385 từ N5-N1) -> tức thời 0ms.
 * 2. Bộ nhớ đệm AsyncStorage trên thiết bị.
 * 3. Gọi Google Apps Script AI / Subtitles endpoint nếu có từ mới chưa có trong kho.
 */
export async function attachVietnameseMeanings(words: VocabularyWord[]): Promise<VocabularyWord[]> {
  if (!words.length) return words;

  const cache = await readCache();
  const untranslated: VocabularyWord[] = [];

  // Lớp 1: Gán tức thời từ kho Prebundled Việt Sub
  const enrichedWords = words.map((word) => {
    // 1. Kiểm tra kho Prebundled
    const prebundled = getPrebundledSubtitle(word);
    if (prebundled) {
      return { ...word, meaningVi: prebundled };
    }

    // 2. Kiểm tra cache AsyncStorage
    const cached = cleanTranslation(cache[cacheId(word)]);
    if (cached) {
      return { ...word, meaningVi: cached };
    }

    untranslated.push(word);
    return word;
  });

  // Lớp 2: Nếu có từ chưa được Việt Sub và GAS được cấu hình -> Gọi GAS
  const wordsToFetch = untranslated.slice(0, MAX_WORDS_PER_REQUEST);
  if (wordsToFetch.length && getGasBaseUrl().trim()) {
    try {
      const response = await callGasApi<VocabularyTranslationResponse>(
        '/ai/vocabulary-translation',
        {
          words: wordsToFetch.map((word) => ({
            id: cacheId(word),
            japanese: word.word,
            reading: word.furigana,
            meaningEn: word.meaning,
          })),
        },
        { timeoutMs: 25_000, retries: 0 },
      );

      let cacheChanged = false;
      for (const item of response.translations ?? []) {
        const id = typeof item.id === 'string' ? item.id : '';
        const meaningVi = cleanTranslation(item.meaningVi);
        if (id && meaningVi) {
          cache[id] = meaningVi;
          cacheChanged = true;

          // Cập nhật ngay vào danh sách trả về
          const target = enrichedWords.find((w) => cacheId(w) === id);
          if (target) {
            target.meaningVi = meaningVi;
          }
        }
      }

      if (cacheChanged) await saveCache(cache);
    } catch (error) {
      console.warn('[vocabularyTranslation] Không thể dịch thêm từ GAS:', error);
    }
  }

  return enrichedWords;
}
