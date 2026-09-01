const fs = require('fs');

const kanji = JSON.parse(fs.readFileSync('src/data/generated/all_kanji.json', 'utf8'));
const englishMeaningLeaks = [];
const englishRadicalLeaks = [];

for (const item of kanji) {
  const englishMeanings = new Set(item.meaningsEn || []);
  for (const meaning of item.meaningsVi || []) {
    if (englishMeanings.has(meaning)) {
      englishMeaningLeaks.push(`${item.character}: ${meaning}`);
    }
  }

  for (const radical of item.radicals || []) {
    if (/[A-Za-z]/.test(`${radical.name} ${radical.meaningVi}`)) {
      englishRadicalLeaks.push(`${item.character}: ${radical.name} (${radical.meaningVi})`);
    }
  }
}

if (englishMeaningLeaks.length || englishRadicalLeaks.length) {
  console.error('Phát hiện dữ liệu Kanji chưa được Việt hóa:');
  for (const leak of [...englishMeaningLeaks, ...englishRadicalLeaks].slice(0, 50)) {
    console.error(`- ${leak}`);
  }
  process.exit(1);
}

console.log(`OK: ${kanji.length} Kanji không còn nghĩa tiếng Anh hiển thị.`);
