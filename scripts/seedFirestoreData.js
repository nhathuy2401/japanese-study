const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const babel = require('@babel/core');
const fs = require('fs');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC0iXxfkb-Y-_1B906Hq-aueRP2qaVRHUo',
  authDomain: 'study-2cf98.firebaseapp.com',
  projectId: 'study-2cf98',
  storageBucket: 'study-2cf98.firebasestorage.app',
  messagingSenderId: '687289920457',
  appId: '1:687289920457:web:4c908a4123d9b8ba515618',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function loadModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const transformed = babel.transformSync(code, {
    configFile: './babel.config.js',
    filename: filePath,
  }).code;
  const m = { exports: {} };
  const fn = new Function('module', 'exports', 'require', transformed);
  fn(m, m.exports, require);
  return m.exports;
}

const n5Grammar = loadModule('src/data/grammar/n5Grammar.ts').N5_GRAMMAR_POINTS;
const n4Grammar = loadModule('src/data/grammar/n4Grammar.ts').N4_GRAMMAR_POINTS;
const n3Grammar = loadModule('src/data/grammar/n3Grammar.ts').N3_GRAMMAR_POINTS;
const n2Grammar = loadModule('src/data/grammar/n2Grammar.ts').N2_GRAMMAR_POINTS;

const n5Kanji = loadModule('src/data/kanji/n5Kanji.ts').N5_KANJI_LIST;
const n4Kanji = loadModule('src/data/kanji/n4Kanji.ts').N4_KANJI_LIST;
const n3Kanji = loadModule('src/data/kanji/n3Kanji.ts').N3_KANJI_LIST;
const n2Kanji = loadModule('src/data/kanji/n2Kanji.ts').N2_KANJI_LIST;

const curriculum = loadModule('src/data/curriculum/curriculumData.ts').CURRICULUM_UNITS;

async function seedFirestore() {
  console.log('🚀 Bắt đầu nạp dữ liệu lên Firebase Firestore (study-2cf98)...');

  const allGrammar = [...n5Grammar, ...n4Grammar, ...n3Grammar, ...n2Grammar];
  console.log(`📦 Đang nạp ${allGrammar.length} mẫu ngữ pháp vào collection grammar_points...`);
  for (const g of allGrammar) {
    await setDoc(doc(db, 'grammar_points', g.id), {
      ...g,
      level: g.levelId,
      updatedAt: new Date().toISOString(),
    });
    process.stdout.write('.');
  }
  console.log('\n✅ Hoàn thành nạp grammar_points!');

  const allKanji = [...n5Kanji, ...n4Kanji, ...n3Kanji, ...n2Kanji];
  console.log(`📦 Đang nạp ${allKanji.length} chữ Kanji vào collection kanji_dict...`);
  for (const k of allKanji) {
    await setDoc(doc(db, 'kanji_dict', k.character), {
      ...k,
      level: k.levelId,
      updatedAt: new Date().toISOString(),
    });
    process.stdout.write('.');
  }
  console.log('\n✅ Hoàn thành nạp kanji_dict!');

  console.log('📦 Đang nạp dữ liệu lộ trình học vào collection curriculum...');
  for (const [level, units] of Object.entries(curriculum)) {
    await setDoc(doc(db, 'curriculum', level), {
      level,
      units,
      updatedAt: new Date().toISOString(),
    });
    console.log(`  - Đã nạp lộ trình cho level ${level.toUpperCase()} (${units.length} units)`);
  }

  console.log('🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC NẠP LÊN FIREBASE FIRESTORE THÀNH CÔNG!');
  process.exit(0);
}

seedFirestore().catch((err) => {
  console.error('❌ Lỗi khi nạp dữ liệu lên Firestore:', err);
  process.exit(1);
});

