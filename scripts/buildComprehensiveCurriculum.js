/**
 * Build Comprehensive Curriculum (N5 - N2)
 * Distributes all 949 grammar points and 979 Kanji into structured, thematic Units
 */

const fs = require('fs');
const path = require('path');

const grammar = JSON.parse(fs.readFileSync('src/data/generated/all_grammar.json', 'utf8'));
const kanji = JSON.parse(fs.readFileSync('src/data/generated/all_kanji.json', 'utf8'));

// Phân loại theo level
const grammarByLevel = {
  n5: grammar.filter((g) => g.levelId === 'n5'),
  n4: grammar.filter((g) => g.levelId === 'n4'),
  n3: grammar.filter((g) => g.levelId === 'n3'),
  n2: grammar.filter((g) => g.levelId === 'n2'),
};

const kanjiByLevel = {
  n5: kanji.filter((k) => k.levelId === 'n5'),
  n4: kanji.filter((k) => k.levelId === 'n4'),
  n3: kanji.filter((k) => k.levelId === 'n3'),
  n2: kanji.filter((k) => k.levelId === 'n2'),
};

const N5_THEMES = [
  { title: 'Chào hỏi & Giới thiệu bản thân', desc: 'Trợ từ は, です, じゃありません, も, の và mẫu câu làm quen cơ bản' },
  { title: 'Chỉ thị từ, Đồ vật & Địa điểm', desc: 'Các chỉ định từ これ, それ, あれ, ここ, そこ, どこ và câu hỏi đồ vật' },
  { title: 'Thời gian, Lịch trình & Số đếm', desc: 'Cách nói giờ phút, ngày tháng, cấu trúc から〜まで và số lượng từ' },
  { title: 'Hành động hàng ngày & Di chuyển', desc: 'Động từ đi đến về (へ行きます), trợ từ địa điểm で và đối tượng を' },
  { title: 'Tính từ miêu tả & Trạng thái', desc: 'Phân biệt tính từ đuôi い, đuôi な, từ chỉ mức độ とても, あまり' },
  { title: 'Thể て, Nhờ vả & Đang tiếp diễn', desc: 'Chia động từ thể て, nhờ vả lịch sự 〜てください, đang làm 〜ています' },
  { title: 'Quy tắc ứng xử, Xin phép & Cấm đoán', desc: 'Cấu trúc cho phép 〜てもいい và cấm đoán nghiêm khắc 〜てはいけません' },
  { title: 'Trình tự hành động & Kết nối', desc: 'Nối tiếp hành động 〜てから, trước khi 〜まえに, sau khi 〜あとで' },
  { title: 'Thể ない & Lời khuyên, Bắt buộc', desc: 'Chia thể ない, yêu cầu không làm 〜ないで, bắt buộc 〜なければなりません' },
  { title: 'Thể từ điển & Khả năng, Sở thích', desc: 'Chia thể từ điển (Jishokei), diễn tả khả năng 〜ことができます và sở thích' },
  { title: 'Thể た & Kinh nghiệm, Liệt kê', desc: 'Chia thể quá khứ た, từng có kinh nghiệm 〜たことがある, liệt kê 〜たり' },
  { title: 'Thể thông thường & Biến đổi, Dự định', desc: 'Giao tiếp thân mật (Futsuukei), biến đổi 〜くなります và dự định 〜つもり' },
];

const N4_THEMES = [
  { title: 'Thể khả năng (可能動詞)', desc: 'Chuyển đổi động từ sang thể khả năng và trợ từ が đi kèm' },
  { title: 'Ý chí & Dự định cá nhân', desc: 'Thể ý chí (意向形), dự định 〜つもり, kế hoạch 〜予定' },
  { title: 'Lời khuyên & Đề xuất hành động', desc: 'Khuyên nên/không nên 〜ほうがいい, gợi ý 〜たらどうですか' },
  { title: 'Phỏng đoán & Suy đoán tương lai', desc: 'Dự đoán thời tiết, sự việc 〜でしょう, có lẽ 〜かもしれません' },
  { title: 'Mệnh lệnh & Cấm chỉ', desc: 'Thể mệnh lệnh (命令形) và cấm chỉ (禁止形) trong biển báo, hô hào' },
  { title: 'Trạng thái tồn tại & Chuẩn bị trước', desc: 'Tha động từ thể 〜てある và hành động chuẩn bị trước 〜ておく' },
  { title: 'Điều kiện と & ば', desc: 'Quy luật tự nhiên với と và điều kiện giả định với thể ば' },
  { title: 'Điều kiện たら & なら', desc: 'Điều kiện sau khi xảy ra với たら và tiếp nhận chủ đề với なら' },
  { title: 'Mục đích & Nỗ lực thực hiện', desc: 'Làm vì mục tiêu 〜ように và vì lợi ích 〜ために' },
  { title: 'Thể bị động (受身形)', desc: 'Biến đổi động từ bị động, bị động gián tiếp gây phiền toái' },
  { title: 'Thể sai khiến (使役形)', desc: 'Bắt buộc hoặc cho phép người khác làm việc gì đó' },
  { title: 'Hành động cho - nhận (授受表現)', desc: 'Các mẫu câu 〜てあげる, 〜てくれる, 〜てもらう biểu đạt ơn nghĩa' },
  { title: 'Sự tiếc nuối & Độ khó dễ', desc: 'Lỡ làm mất, tiếc nuối 〜てしまう, dễ làm 〜やすい, khó làm 〜にくい' },
  { title: 'Trích dẫn & Truyền đạt thông tin', desc: 'Nghe nói rằng 〜そうです, trích dẫn lời người khác' },
  { title: 'Kính ngữ & Khiêm nhường ngữ', desc: 'Giao tiếp trang trọng: Tôn kính ngữ (尊敬語) và Khiêm nhường ngữ (謙譲語)' },
];

function buildUnitsForLevel(levelId, themes, totalUnitsCount) {
  const gList = grammarByLevel[levelId] || [];
  const kList = kanjiByLevel[levelId] || [];

  const units = [];
  const gPerUnit = Math.ceil(gList.length / totalUnitsCount);
  const kPerUnit = Math.ceil(kList.length / totalUnitsCount);

  for (let i = 0; i < totalUnitsCount; i++) {
    const unitIndex = i + 1;
    const unitId = `${levelId}-u${unitIndex}`;
    const theme = themes[i] || {
      title: `Chủ đề trọng điểm phần ${unitIndex}`,
      desc: `Tổng hợp các cấu trúc ngữ pháp và chữ Hán JLPT ${levelId.toUpperCase()} bậc ${unitIndex}`,
    };

    const unitGrammar = gList.slice(i * gPerUnit, (i + 1) * gPerUnit);
    const unitKanji = kList.slice(i * kPerUnit, (i + 1) * kPerUnit);

    const lessons = [];

    // Tạo các bài học ngữ pháp (kèm kanji xen kẽ)
    unitGrammar.forEach((g, gIdx) => {
      const pairedKanji = unitKanji[gIdx % Math.max(1, unitKanji.length)];
      lessons.push({
        id: `${unitId}-l${gIdx + 1}`,
        title: `Bài ${gIdx + 1}: ${g.pattern}`,
        type: 'grammar',
        durationMinutes: 8,
        grammarPointId: g.id,
        kanjiId: pairedKanji ? pairedKanji.character : undefined,
      });
    });

    // Nếu có thêm Kanji chưa gán, bổ sung bài ôn Kanji
    if (unitKanji.length > unitGrammar.length) {
      unitKanji.slice(unitGrammar.length).forEach((k, extraIdx) => {
        lessons.push({
          id: `${unitId}-k${extraIdx + 1}`,
          title: `Hán tự: ${k.character} (${(k.meaningsVi || []).slice(0, 2).join(', ')})`,
          type: 'kanji',
          durationMinutes: 6,
          kanjiId: k.character,
        });
      });
    }

    units.push({
      id: unitId,
      levelId: levelId,
      title: `Unit ${unitIndex}: ${theme.title}`,
      description: theme.desc,
      sortOrder: unitIndex,
      lessons: lessons,
    });
  }

  return units;
}

console.log('🚀 Đang tổng hợp lộ trình Units toàn diện...');

const n5Units = buildUnitsForLevel('n5', N5_THEMES, 12);
const n4Units = buildUnitsForLevel('n4', N4_THEMES, 15);

// N3 (20 Units)
const n3Themes = Array.from({ length: 20 }, (_, i) => ({
  title: `Chủ điểm Trung cấp ${i + 1}`,
  desc: `Tổ hợp cấu trúc ngữ pháp và Hán tự chuyên sâu N3 phần ${i + 1}`,
}));
const n3Units = buildUnitsForLevel('n3', n3Themes, 20);

// N2 (20 Units)
const n2Themes = Array.from({ length: 20 }, (_, i) => ({
  title: `Chủ điểm Cao cấp ${i + 1}`,
  desc: `Văn phong nghị luận, thương mại và giao tiếp nâng cao N2 phần ${i + 1}`,
}));
const n2Units = buildUnitsForLevel('n2', n2Themes, 20);

const ALL_CURRICULUM = {
  n5: n5Units,
  n4: n4Units,
  n3: n3Units,
  n2: n2Units,
};

// 1. Ghi file JSON bundle cho app
fs.mkdirSync('src/data/generated', { recursive: true });
fs.writeFileSync('src/data/generated/all_curriculum.json', JSON.stringify(ALL_CURRICULUM, null, 2));

// 2. Ghi file TypeScript curriculumData.ts
const tsContent = `export interface LessonMeta {
  id: string;
  title: string;
  type: 'grammar' | 'kanji' | 'reading' | 'review';
  durationMinutes: number;
  grammarPointId?: string;
  kanjiId?: string;
}

export interface UnitData {
  id: string;
  levelId: 'n5' | 'n4' | 'n3' | 'n2';
  title: string;
  description: string;
  sortOrder: number;
  lessons: LessonMeta[];
}

export const CURRICULUM_UNITS: Record<string, UnitData[]> = ${JSON.stringify(
  ALL_CURRICULUM,
  null,
  2
)};
`;

fs.writeFileSync('src/data/curriculum/curriculumData.ts', tsContent);

console.log('✅ HOÀN TẤT BỘ LỘ TRÌNH UNITS TOÀN DIỆN:');
console.log(`- N5: ${n5Units.length} Units (${n5Units.reduce((acc, u) => acc + u.lessons.length, 0)} bài học)`);
console.log(`- N4: ${n4Units.length} Units (${n4Units.reduce((acc, u) => acc + u.lessons.length, 0)} bài học)`);
console.log(`- N3: ${n3Units.length} Units (${n3Units.reduce((acc, u) => acc + u.lessons.length, 0)} bài học)`);
console.log(`- N2: ${n2Units.length} Units (${n2Units.reduce((acc, u) => acc + u.lessons.length, 0)} bài học)`);
console.log(`- Tổng cộng: ${n5Units.length + n4Units.length + n3Units.length + n2Units.length} Units trên toàn bộ các cấp độ!`);

