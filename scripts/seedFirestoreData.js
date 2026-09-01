/**
 * Firestore Database Seeder Script (Master Datasets)
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
  authDomain: 'study-2cf98.firebaseapp.com',
  projectId: 'study-2cf98',
  storageBucket: 'study-2cf98.firebasestorage.app',
  messagingSenderId: '687289920457',
  appId: '1:687289920457:web:4c908a4123d9b8ba515618',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const { N5_GRAMMAR_POINTS } = require('../src/data/grammar/n5Grammar');
const { N4_GRAMMAR_POINTS } = require('../src/data/grammar/n4Grammar');
const { N3_GRAMMAR_POINTS } = require('../src/data/grammar/n3Grammar');
const { N2_GRAMMAR_POINTS } = require('../src/data/grammar/n2Grammar');

const { N5_KANJI_LIST } = require('../src/data/kanji/n5Kanji');
const { N4_KANJI_LIST } = require('../src/data/kanji/n4Kanji');
const { N3_KANJI_LIST } = require('../src/data/kanji/n3Kanji');
const { N2_KANJI_LIST } = require('../src/data/kanji/n2Kanji');

const {
  N5_CURRICULUM,
  N4_CURRICULUM,
  N3_CURRICULUM,
  N2_CURRICULUM,
} = require('../src/data/curriculum/curriculumData');

async function seedDatabase() {
  console.log('🚀 Bắt đầu nạp dữ liệu lên Firebase Firestore (study-2cf98)...');

  const allGrammar = [
    ...N5_GRAMMAR_POINTS,
    ...N4_GRAMMAR_POINTS,
    ...N3_GRAMMAR_POINTS,
    ...N2_GRAMMAR_POINTS,
  ];

  console.log(`📦 Đang nạp ${allGrammar.length} mẫu ngữ pháp vào collection grammar_points...`);
  for (const item of allGrammar) {
    const docRef = doc(db, 'grammar_points', item.id);
    await setDoc(docRef, item, { merge: true });
    process.stdout.write('.');
  }
  console.log('\n✅ Hoàn thành nạp grammar_points!');

  const allKanji = [
    ...N5_KANJI_LIST,
    ...N4_KANJI_LIST,
    ...N3_KANJI_LIST,
    ...N2_KANJI_LIST,
  ];

  console.log(`📦 Đang nạp ${allKanji.length} chữ Kanji vào collection kanji_dict...`);
  for (const item of allKanji) {
    const docRef = doc(db, 'kanji_dict', item.character);
    await setDoc(docRef, item, { merge: true });
    process.stdout.write('.');
  }
  console.log('\n✅ Hoàn thành nạp kanji_dict!');

  console.log('📦 Đang nạp dữ liệu lộ trình học vào collection curriculum...');
  const curriculums = [
    { level: 'n5', data: N5_CURRICULUM },
    { level: 'n4', data: N4_CURRICULUM },
    { level: 'n3', data: N3_CURRICULUM },
    { level: 'n2', data: N2_CURRICULUM },
  ];

  for (const curr of curriculums) {
    const docRef = doc(db, 'curriculum', curr.level);
    await setDoc(docRef, curr.data, { merge: true });
    console.log(`  - Đã nạp lộ trình cho level ${curr.level.toUpperCase()} (${curr.data.units.length} units)`);
  }

  console.log('🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC NẠP LÊN FIREBASE FIRESTORE THÀNH CÔNG!');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('❌ Lỗi khi nạp dữ liệu Firebase:', err);
  process.exit(1);
});
