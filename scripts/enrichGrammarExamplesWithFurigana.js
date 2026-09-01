/**
 * Enrich all grammar examples in all_grammar.json with accurate Furigana tokens
 */

const fs = require('fs');
const path = require('path');

const dict = JSON.parse(fs.readFileSync('src/data/generated/furigana_dict.json', 'utf8'));

const COMMON_OVERRIDE = {
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

function isKanjiChar(char) {
  return /[\u4e00-\u9faf]/.test(char);
}

function parseSentence(text) {
  if (!text) return [];
  const segments = [];
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

    let matched = false;
    for (let len = Math.min(6, text.length - i); len >= 2; len--) {
      const sub = text.slice(i, i + len);

      if (COMMON_OVERRIDE[sub]) {
        segments.push({ text: sub, furigana: COMMON_OVERRIDE[sub], isKanji: true });
        i += len;
        matched = true;
        break;
      }

      if (dict.words[sub]) {
        const furi = dict.words[sub];
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
      const furi = COMMON_OVERRIDE[ch] || dict.stems[ch] || dict.kanji[ch];
      segments.push({ text: ch, furigana: furi, isKanji: true });
      i++;
    }
  }

  return segments;
}

function run() {
  console.log('🚀 Đang làm giàu Furigana cho toàn bộ câu ví dụ ngữ pháp...');
  const grammar = JSON.parse(fs.readFileSync('src/data/generated/all_grammar.json', 'utf8'));

  let totalExamples = 0;
  let totalKanjiWithFurigana = 0;

  for (const g of grammar) {
    for (const ex of g.examples || []) {
      totalExamples++;
      const segments = parseSentence(ex.japanese);
      
      ex.tokens = segments.map((seg, idx) => {
        if (seg.isKanji && seg.furigana) {
          totalKanjiWithFurigana++;
        }
        return {
          id: `${idx + 1}`,
          kanji: seg.text,
          furigana: seg.furigana || seg.text,
          meaningVi: seg.isKanji ? 'Từ Kanji' : 'Trợ từ / Kana',
          pos: seg.isKanji ? 'Kanji' : 'Kana',
        };
      });
    }
  }

  fs.writeFileSync('src/data/generated/all_grammar.json', JSON.stringify(grammar, null, 2));

  console.log(`✅ HOÀN THÀNH:`);
  console.log(`- Tổng số câu ví dụ: ${totalExamples}`);
  console.log(`- Tổng số từ Kanji được gắn Furigana: ${totalKanjiWithFurigana}`);
  console.log(`- File đã lưu: src/data/generated/all_grammar.json`);
}

run();

