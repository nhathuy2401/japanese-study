/**
 * Generate comprehensive Furigana dictionary for automatic sentence annotation
 * Combines JLPT Vocab Dataset (8,385 words) and JLPT Kanji Readings (979 Kanji)
 */

const fs = require('fs');

async function run() {
  console.log('🚀 Đang tải từ điển JLPT để tạo Furigana Dictionary...');
  const res = await fetch('https://raw.githubusercontent.com/wkei/jlpt-vocab-api/main/data-source/db/all.json');
  const allVocab = await res.json();

  const allKanji = JSON.parse(fs.readFileSync('src/data/generated/all_kanji.json', 'utf8'));

  const wordsMap = {};
  const kanjiStemMap = {
    // Các tiền tố / gốc động từ và tính từ thông dụng nhất trong JLPT
    '食': 'た',
    '飲': 'の',
    '見': 'み',
    '聞': 'き',
    '読': 'よ',
    '書': 'か',
    '話': 'はな',
    '行': 'い',
    '来': 'く',
    '帰': 'かえ',
    '出': 'で',
    '入': 'はい',
    '寝': 'ね',
    '起': 'お',
    '買': 'か',
    '売': 'う',
    '待': 'ま',
    '持': 'も',
    '使': 'つか',
    '作': 'つく',
    '泳': 'およ',
    '走': 'はし',
    '歩': 'ある',
    '飛': 'と',
    '乗': 'の',
    '降': 'お',
    '開': 'あ',
    '閉': 'し',
    '止': 'と',
    '始': 'はじ',
    '終': 'お',
    '知': 'し',
    '思': 'おも',
    '言': 'い',
    '会': 'あ',
    '立': 'た',
    '座': 'すわ',
    '教': 'おし',
    '習': 'なら',
    '洗': 'あら',
    '住': 'す',
    '働': 'はたら',
    '休': 'やす',
    '急': 'いそ',
    '貸': 'か',
    '借': 'か',
    '送': 'おく',
    '切': 'き',
    '着': 'き',
    '脱': 'ぬ',
    '大': 'おお',
    '小': 'ちい',
    '高': 'たか',
    '低': 'ひく',
    '安': 'やす',
    '新': 'あたら',
    '古': 'ふる',
    '長': 'なが',
    '短': 'みじか',
    '早': 'はや',
    '遅': 'おそ',
    '暑': 'あつ',
    '寒': 'さむ',
    '熱': 'あつ',
    '冷': 'つめ',
    '暖': 'あたた',
    '涼': 'すず',
    '明': 'あか',
    '暗': 'くら',
    '強': 'つよ',
    '弱': 'よわ',
    '多': 'おお',
    '少': 'すく',
    '美': 'うつく',
    '好': 'す',
    '嫌': 'きら',
  };

  // 1. Nạp từ vựng Kanji và trích xuất okurigana
  for (const item of allVocab) {
    if (item.word && item.furigana && item.word !== item.furigana) {
      wordsMap[item.word] = item.furigana;

      // Trích xuất gốc kanji
      const m = item.word.match(/^([\u4e00-\u9faf]+)([\u3040-\u309f]+)$/);
      if (m) {
        const kanji = m[1];
        const okuri = m[2];
        if (item.furigana.endsWith(okuri) && !kanjiStemMap[kanji]) {
          const reading = item.furigana.slice(0, -okuri.length);
          if (reading) {
            kanjiStemMap[kanji] = reading;
          }
        }
      }
    }
  }

  // 2. Nạp đọc đơn âm cho từng chữ Kanji từ all_kanji.json
  const singleKanjiMap = {};
  for (const k of allKanji) {
    let reading = kanjiStemMap[k.character];
    if (!reading) {
      // Ưu tiên Kunyomi (bỏ dấu chấm/gạch) hoặc Onyomi (đổi Katakana sang Hiragana)
      if (k.kunyomi && k.kunyomi.length > 0) {
        reading = k.kunyomi[0].replace(/[.\-]/g, '');
      } else if (k.onyomi && k.onyomi.length > 0) {
        // Katakana to Hiragana
        reading = k.onyomi[0].replace(/[\u30a1-\u30f6]/g, (ch) =>
          String.fromCharCode(ch.charCodeAt(0) - 0x60)
        );
      }
    }
    if (reading) {
      singleKanjiMap[k.character] = reading;
    }
  }

  const result = {
    words: wordsMap,
    stems: kanjiStemMap,
    kanji: singleKanjiMap,
  };

  fs.mkdirSync('src/data/generated', { recursive: true });
  fs.writeFileSync('src/data/generated/furigana_dict.json', JSON.stringify(result));

  console.log('✅ ĐÃ TẠO TỪ ĐIỂN FURIGANA:');
  console.log(`- Từ vựng ghép (words): ${Object.keys(wordsMap).length}`);
  console.log(`- Gốc động/tính từ (stems): ${Object.keys(kanjiStemMap).length}`);
  console.log(`- Đọc Kanji đơn (single kanji): ${Object.keys(singleKanjiMap).length}`);
  console.log(`- Dung lượng: ${(fs.statSync('src/data/generated/furigana_dict.json').size / 1024).toFixed(1)} KB`);
}

run().catch(console.error);

