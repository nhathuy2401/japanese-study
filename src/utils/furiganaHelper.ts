/**
 * Furigana Parser and Segmentation Utility
 * Breaks down Japanese sentences into Kanji/Ruby segments and Kana/particles
 */

let FURIGANA_DICT: {
  words: Record<string, string>;
  stems: Record<string, string>;
  kanji: Record<string, string>;
} = { words: {}, stems: {}, kanji: {} };

try {
  FURIGANA_DICT = require('../data/generated/furigana_dict.json');
} catch (e) {
  // Dự phòng nếu chưa sinh file
  FURIGANA_DICT = { words: {}, stems: {}, kanji: {} };
}

// Ưu tiên cách đọc thông dụng nhất trong ngữ cảnh JLPT
const COMMON_OVERRIDE: Record<string, string> = {
  '私': 'わたし',
  '時': 'じ',
  '日': 'ひ',
  '月': 'つき',
  '年': 'とし',
  '何': 'なに',
  '人': 'ひと',
  '朝ご飯': 'あさごはん',
  '昼ご飯': 'ひるごはん',
  '晩ご飯': 'ばんごはん',
  'ご飯': 'ごはん',
};

export interface FuriganaSegment {
  text: string;
  furigana?: string;
  isKanji: boolean;
}

export function isKanjiChar(char: string): boolean {
  return /[\u4e00-\u9faf]/.test(char);
}

export function containsKanji(text: string): boolean {
  return /[\u4e00-\u9faf]/.test(text);
}

/**
 * Tách một câu hoặc từ tiếng Nhật thành các phân đoạn (segments) kèm Furigana
 * Hỗ trợ:
 * 1. Cú pháp đánh dấu trực tiếp: 家族[かぞく] hoặc 家族(かぞく)
 * 2. Tự động tra cứu từ điển JLPT 8,385 từ và 979 Kanji
 */
export function parseFurigana(text: string): FuriganaSegment[] {
  if (!text) return [];

  // 1. Kiểm tra nếu có cú pháp đánh dấu sẵn: 漢字[かんじ]
  if (/[\u4e00-\u9faf]+\[[\u3040-\u309f]+\]/.test(text)) {
    const segments: FuriganaSegment[] = [];
    const re = /([\u4e00-\u9faf]+)\[([\u3040-\u309f]+)\]|([^\u4e00-\u9faf\[]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m[1]) {
        segments.push({ text: m[1], furigana: m[2], isKanji: true });
      } else if (m[3]) {
        segments.push({ text: m[3], isKanji: false });
      }
    }
    return segments;
  }

  // 2. Kiểm tra cú pháp ngoặc tròn: 漢字(かんじ)
  if (/[\u4e00-\u9faf]+\([\u3040-\u309f]+\)/.test(text)) {
    const segments: FuriganaSegment[] = [];
    const re = /([\u4e00-\u9faf]+)\(([\u3040-\u309f]+)\)|([^\u4e00-\u9faf\(]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m[1]) {
        segments.push({ text: m[1], furigana: m[2], isKanji: true });
      } else if (m[3]) {
        segments.push({ text: m[3], isKanji: false });
      }
    }
    return segments;
  }

  // 3. Tự động phân tích câu văn bằng từ điển thông minh (Greedy Longest Matching)
  const segments: FuriganaSegment[] = [];
  let i = 0;

  while (i < text.length) {
    if (!isKanjiChar(text[i])) {
      let nonKanji = '';
      while (i < text.length && !isKanjiChar(text[i])) {
        nonKanji += text[i];
        i++;
      }
      segments.push({ text: nonKanji, isKanji: false });
      continue;
    }

    // Gặp chữ Kanji: thử ghép từ dài nhất (từ 6 ký tự giảm dần về 2)
    let matched = false;
    for (let len = Math.min(6, text.length - i); len >= 2; len--) {
      const sub = text.slice(i, i + len);

      if (COMMON_OVERRIDE[sub]) {
        segments.push({ text: sub, furigana: COMMON_OVERRIDE[sub], isKanji: true });
        i += len;
        matched = true;
        break;
      }

      if (FURIGANA_DICT.words[sub]) {
        const furi = FURIGANA_DICT.words[sub];
        // Nếu từ có đuôi Okurigana (ví dụ: 食べる -> たべる)
        const m = sub.match(/^([\u4e00-\u9faf]+)([\u3040-\u309f]+)$/);
        if (m && furi.endsWith(m[2])) {
          segments.push({
            text: m[1],
            furigana: furi.slice(0, -m[2].length),
            isKanji: true,
          });
          segments.push({
            text: m[2],
            isKanji: false,
          });
        } else {
          segments.push({ text: sub, furigana: furi, isKanji: true });
        }
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const ch = text[i];
      const furi = COMMON_OVERRIDE[ch] || FURIGANA_DICT.stems[ch] || FURIGANA_DICT.kanji[ch];
      segments.push({ text: ch, furigana: furi, isKanji: true });
      i++;
    }
  }

  return segments;
}

