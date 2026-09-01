/**
 * Extended Pure Vietnamese Grammar & Kanji Translation Polish
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch } = require('firebase/firestore');
const fs = require('fs');

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

const EN_VI_PHRASES = [
  [/\bthe best\b/gi, 'tốt nhất, tuyệt nhất'],
  [/\bso much.*that\b/gi, 'quá mức đến nỗi mà'],
  [/\bto want something\b/gi, 'muốn có một thứ gì đó'],
  [/\bongoing action or current state\b/gi, 'hành động đang tiếp diễn hoặc trạng thái hiện tại'],
  [/\bas much as\b/gi, 'nhiều như, đến mức'],
  [/\bto do something\b/gi, 'làm một việc gì đó'],
  [/\bin order to\b/gi, 'để làm gì, nhằm mục đích'],
  [/\bafter doing\b/gi, 'sau khi làm'],
  [/\bbefore doing\b/gi, 'trước khi làm'],
  [/\bmust not do\b/gi, 'không được phép làm'],
  [/\bmust do\b/gi, 'phải làm'],
  [/\bcan do\b/gi, 'có thể làm'],
  [/\beasy to\b/gi, 'dễ làm'],
  [/\bhard to\b/gi, 'khó làm'],
  [/\blook like\b/gi, 'trông có vẻ như'],
  [/\bseem like\b/gi, 'dường như'],
  [/\bdecide to\b/gi, 'quyết định làm'],
  [/\bplan to\b/gi, 'lên kế hoạch làm'],
  [/\beven if\b/gi, 'ngay cả khi, dù cho'],
  [/\balthough\b/gi, 'mặc dù'],
  [/\bbecause of\b/gi, 'bởi vì, do'],
  [/\bdue to\b/gi, 'do nguyên nhân'],
  [/\bthanks to\b/gi, 'nhờ có, nhờ ơn'],
  [/\bevery time\b/gi, 'mỗi lần, mỗi khi'],
  [/\bas soon as\b/gi, 'ngay sau khi'],
  [/\bwhile doing\b/gi, 'trong khi đang làm'],
  [/\bused to\b/gi, 'đã từng'],
  [/\btend to\b/gi, 'có xu hướng, hay bị'],
  [/\bonly\b/gi, 'chỉ'],
  [/\bjust\b/gi, 'vừa mới, chỉ'],
  [/\bwithout doing\b/gi, 'mà không làm gì'],
  [/\bhave experience\b/gi, 'có kinh nghiệm làm gì'],
  [/\bshould do\b/gi, 'nên làm gì'],
  [/\bshould not do\b/gi, 'không nên làm gì'],
];

function polishVietnamese(text) {
  if (!text) return 'Mẫu ngữ pháp tiếng Nhật';
  let s = text.replace(/Mẫu ngữ pháp diễn đạt ý:\s*/gi, '');
  for (const [pattern, vi] of EN_VI_PHRASES) {
    s = s.replace(pattern, vi);
  }
  s = s.replace(/\([A-Za-z\s\.,;:]+\)/g, '').trim();
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

async function polishAll() {
  console.log('✨ Làm sạch và tinh chỉnh tiếng Việt tự nhiên cho 100% ngữ pháp...');
  const grammarList = JSON.parse(fs.readFileSync('src/data/generated/all_grammar.json', 'utf8'));

  for (const g of grammarList) {
    g.meaningVi = polishVietnamese(g.meaningVi);
    if (g.formation && g.formation[0]) {
      g.formation[0].explanationVi = `Mẫu câu "${g.pattern}" dùng để diễn đạt: ${g.meaningVi}`;
    }
  }

  fs.writeFileSync('src/data/generated/all_grammar.json', JSON.stringify(grammarList, null, 2));
  console.log('✅ Đã tinh chỉnh xong file all_grammar.json!');

  if (!firebaseConfig.apiKey) {
    console.log('ℹ️ Không có API key môi trường, bỏ qua ghi Firestore.');
    process.exit(0);
  }

  console.log('🚀 Cập nhật bản dịch tiếng Việt hoàn chỉnh lên Firestore...');
  const BATCH_SIZE = 300;
  for (let i = 0; i < grammarList.length; i += BATCH_SIZE) {
    const chunk = grammarList.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    for (const item of chunk) {
      const docRef = doc(db, 'grammar_points', item.id);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`  - Đã cập nhật ${Math.min(i + BATCH_SIZE, grammarList.length)} / ${grammarList.length} grammar_points`);
  }

  console.log('🎉 Hoàn tất tinh chỉnh toàn diện!');
  process.exit(0);
}

polishAll().catch((err) => {
  console.error('Lỗi tinh chỉnh:', err);
  process.exit(1);
});
