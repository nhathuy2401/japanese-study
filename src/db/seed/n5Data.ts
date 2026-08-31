import { DomainGrammarPoint, DomainKanji, SrsCardData, DailyQuest } from '../../domain/entities/types';

export const SEED_LEVELS = [
  { id: 'intro', title: 'Nhập môn: Kana & Phát âm', sortOrder: 1 },
  { id: 'n5', title: 'JLPT N5: Nền tảng căn bản', sortOrder: 2 },
  { id: 'n4', title: 'JLPT N4: Sơ cấp thực chiến', sortOrder: 3 },
  { id: 'n3', title: 'JLPT N3: Trung cấp đời sống', sortOrder: 4 },
  { id: 'n2', title: 'JLPT N2: Nâng cao & Học thuật', sortOrder: 5 },
];

export const SEED_UNITS = [
  {
    id: 'n5-u1',
    levelId: 'n5',
    title: 'Unit 1: Chào hỏi & Giới thiệu bản thân',
    description: 'Làm quen với trợ từ は, です, じゃありません và văn hóa cúi chào',
    sortOrder: 1,
  },
  {
    id: 'n5-u2',
    levelId: 'n5',
    title: 'Unit 2: Đồ vật, Địa điểm & Số đếm',
    description: 'Chỉ định từ これ, それ, あれ và mẫu hỏi giá tiền',
    sortOrder: 2,
  },
  {
    id: 'n5-u3',
    levelId: 'n5',
    title: 'Unit 3: Hoạt động hàng ngày & Thể て',
    description: 'Mẫu câu nhờ vả, xin phép và cấm đoán',
    sortOrder: 3,
  },
];

export const SEED_GRAMMAR_POINTS: DomainGrammarPoint[] = [
  {
    id: 'g-te-wa-ikemasen',
    levelId: 'n5',
    pattern: '〜てはいけません',
    meaningVi: 'Không được phép làm gì (Cấm đoán mang tính quy tắc)',
    formation: [
      {
        component: 'Động từ thể て (V-て)',
        explanationVi: 'Chuyển động từ sang thể Te rồi ghép với はいけません',
        example: 'たべて + はいけません ➔ たべてはいけません (Không được ăn)',
      },
      {
        component: 'Động từ nhóm 1: す ➔ して',
        explanationVi: 'はなす ➔ はなして + はいけません ➔ はなしてはいけません (Không được nói chuyện)',
        example: 'ここで はなしてはいけません',
      },
    ],
    nuanceBadges: [
      { label: '⛔ Cấm đoán/Quy tắc', type: 'warning' },
      { label: '👔 Lịch sự/Trang trọng', type: 'polite' },
      { label: '🗣️ Văn nói', type: 'spoken' },
    ],
    commonMistakes: [
      'Không dùng cho việc nhờ vả bạn bè thân mật. Dùng 〜ないでください nếu muốn khuyên bảo nhẹ nhàng.',
      'Tránh nhầm trợ từ は trong はいけません (đọc là "wa", không đọc là "ha").',
    ],
    examples: [
      {
        japanese: 'ここで 写真を 撮ってはいけません。',
        reading: 'ここで しゃしんを とってはいけません。',
        meaningVi: 'Không được phép chụp ảnh ở đây.',
        tokens: [
          { id: '1', kanji: 'ここ', furigana: 'ここ', meaningVi: 'Ở đây', pos: 'Địa điểm' },
          { id: '2', kanji: 'で', meaningVi: 'Tại', pos: 'Trợ từ' },
          { id: '3', kanji: '写真', furigana: 'しゃしん', hanViet: 'TẢ CHÂN', meaningVi: 'Ảnh', pos: 'Danh từ' },
          { id: '4', kanji: 'を', meaningVi: 'Chỉ tân ngữ', pos: 'Trợ từ' },
          { id: '5', kanji: '撮ってはいけません', furigana: 'とってはいけません', meaningVi: 'Không được chụp', pos: 'Động từ' },
        ],
      },
      {
        japanese: '美術館で 走ってはいけません。',
        reading: 'びじゅつかんで はしってはいけません。',
        meaningVi: 'Không được chạy trong viện bảo tàng nghệ thuật.',
        tokens: [
          { id: '6', kanji: '美術館', furigana: 'びじゅつかん', hanViet: 'MỸ THUẬT QUÁN', meaningVi: 'Bảo tàng mỹ thuật', pos: 'Danh từ' },
          { id: '7', kanji: 'で', meaningVi: 'Trong / Tại', pos: 'Trợ từ' },
          { id: '8', kanji: '走ってはいけません', furigana: 'はしってはいけません', meaningVi: 'Không được chạy', pos: 'Động từ' },
        ],
      },
    ],
  },
];

export const SEED_KANJI: DomainKanji[] = [
  {
    id: 'k-kyu',
    character: '休',
    levelId: 'n5',
    meaningsVi: ['Nghỉ ngơi', 'Nghỉ học/làm', 'Hưu'],
    onyomi: ['KYŪ (きゅう)'],
    kunyomi: ['yasu-mu (休む)', 'yasu-mi (休み)'],
    strokeCount: 6,
    radicals: [
      { symbol: '亻', name: 'Nhân đứng', meaningVi: 'Người' },
      { symbol: '木', name: 'Mộc', meaningVi: 'Cây cối' },
    ],
    mnemonic: 'Một NGƯỜI (亻) tựa lưng vào gốc CÂY (木) để NGHỈ NGƠI (休).',
    vocabCompounds: [
      { expression: '休み', reading: 'やすみ', meaningVi: 'Ngày nghỉ, giờ giải lao' },
      { expression: '休日', reading: 'きゅうじつ', meaningVi: 'Ngày nghỉ lễ' },
      { expression: '夏休み', reading: 'なつやすみ', meaningVi: 'Kỳ nghỉ hè' },
    ],
  },
];

export const SEED_SRS_CARDS: SrsCardData[] = [
  {
    id: 'srs-1',
    contentType: 'grammar',
    contentId: 'g-te-wa-ikemasen',
    cardType: 'recognition',
    dueAt: new Date(Date.now() - 1000 * 60 * 30), // Due now
    stability: 2.0,
    difficulty: 5.0,
    reps: 2,
    lapses: 0,
    state: 'review',
    prompt: '〜てはいけません',
    answer: 'Không được phép làm gì (Cấm đoán theo quy tắc)',
    exampleSentence: 'ここで タバコを すってはいけません。(Không được hút thuốc ở đây.)',
  },
  {
    id: 'srs-2',
    contentType: 'kanji',
    contentId: 'k-kyu',
    cardType: 'recognition',
    dueAt: new Date(Date.now() - 1000 * 60 * 15),
    stability: 3.5,
    difficulty: 4.0,
    reps: 3,
    lapses: 0,
    state: 'review',
    prompt: '休',
    reading: 'やす(む) / キュウ',
    answer: 'Nghỉ ngơi, Hưu',
    extraInfo: '亻(Người) + 木(Cây)',
    exampleSentence: 'きょうは やすみ です。(Hôm nay là ngày nghỉ.)',
  },
  {
    id: 'srs-3',
    contentType: 'vocab',
    contentId: 'v-yakusoku',
    cardType: 'recall',
    dueAt: new Date(Date.now() - 1000 * 60 * 5),
    stability: 1.5,
    difficulty: 6.0,
    reps: 1,
    lapses: 0,
    state: 'review',
    prompt: '約束',
    reading: 'やくそく [0 - Heiban]',
    answer: 'Lời hứa, cuộc hẹn',
    exampleSentence: 'ともだちと やくそくが あります。(Tôi có hẹn với bạn.)',
  },
];

export const SEED_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest-1',
    title: 'Hoàn thành 1 bài học mới',
    targetCount: 1,
    currentCount: 1,
    xpReward: 20,
    isCompleted: true,
  },
  {
    id: 'quest-2',
    title: 'Luyện 1 câu Shadowing phát âm',
    targetCount: 1,
    currentCount: 0,
    xpReward: 15,
    isCompleted: false,
  },
  {
    id: 'quest-3',
    title: 'Ôn tập toàn bộ thẻ SRS đến hạn',
    targetCount: 3,
    currentCount: 1,
    xpReward: 25,
    isCompleted: false,
  },
];

