import { DomainGrammarPoint } from '../../domain/entities/types';

export const N5_GRAMMAR_POINTS: DomainGrammarPoint[] = [
  {
    id: 'n5_wa_desu',
    levelId: 'n5',
    pattern: 'N1 は N2 です',
    meaningVi: 'N1 là N2 (Khẳng định cơ bản)',
    formation: [
      {
        component: 'Chủ ngữ + は + Danh từ + です',
        explanationVi: 'は (đọc là wa) là trợ từ chỉ chủ đề của câu. です dùng để kết thúc câu lịch sự.',
        example: 'わたし は がくせい です (Tôi là học sinh)',
      },
    ],
    nuanceBadges: [
      { label: '👔 Lịch sự / Căn bản', type: 'polite' },
      { label: '🗣️ Văn nói & Viết', type: 'spoken' },
    ],
    commonMistakes: [
      'Trợ từ は trong câu khẳng định phải phát âm là "wa", không phát âm là "ha".',
    ],
    examples: [
      {
        japanese: '私は ベトナム人 です。',
        reading: 'わたしは ベトナムじん です。',
        meaningVi: 'Tôi là người Việt Nam.',
        tokens: [
          { id: '1', kanji: '私', furigana: 'わたし', hanViet: 'TƯ', meaningVi: 'Tôi', pos: 'Đại từ' },
          { id: '2', kanji: 'は', meaningVi: 'Là (trợ từ chủ đề)', pos: 'Trợ từ' },
          { id: '3', kanji: 'ベトナム人', furigana: 'ベトナムじん', hanViet: 'NHÂN', meaningVi: 'Người Việt Nam', pos: 'Danh từ' },
          { id: '4', kanji: 'です', meaningVi: 'Là / Thì', pos: 'Trợ động từ' },
        ],
      },
      {
        japanese: '田中さんは 先生 です。',
        reading: 'たなかさんは せんせい です。',
        meaningVi: 'Anh Tanaka là giáo viên.',
        tokens: [
          { id: '5', kanji: '田中さん', furigana: 'たなかさん', hanViet: 'ĐIỀN TRUNG', meaningVi: 'Anh Tanaka', pos: 'Danh từ' },
          { id: '6', kanji: 'は', meaningVi: 'Là (chủ đề)', pos: 'Trợ từ' },
          { id: '7', kanji: '先生', furigana: 'せんせい', hanViet: 'TIÊN SINH', meaningVi: 'Giáo viên', pos: 'Danh từ' },
          { id: '8', kanji: 'です', meaningVi: 'Là', pos: 'Trợ động từ' },
        ],
      },
    ],
  },
  {
    id: 'n5_ja_arimasen',
    levelId: 'n5',
    pattern: 'N1 は N2 ではありません / じゃありません',
    meaningVi: 'N1 không phải là N2 (Phủ định)',
    formation: [
      {
        component: 'Chủ ngữ + は + N2 + ではありません / じゃありません',
        explanationVi: 'ではありません trang trọng hơn trong văn viết, じゃありません dùng phổ biến trong giao tiếp hàng ngày.',
        example: 'わたし は せんせい じゃありません (Tôi không phải là giáo viên)',
      },
    ],
    nuanceBadges: [
      { label: '👔 Phủ định lịch sự', type: 'polite' },
      { label: '🗣️ Khẩu ngữ', type: 'spoken' },
    ],
    commonMistakes: [
      'Trong văn viết trang trọng hoặc bài thi, ưu tiên dùng ではありません thay vì じゃありません.',
    ],
    examples: [
      {
        japanese: '彼は 医者 じゃありません。',
        reading: 'かれは いしゃ じゃありません。',
        meaningVi: 'Anh ấy không phải là bác sĩ.',
        tokens: [
          { id: '1', kanji: '彼', furigana: 'かれ', hanViet: 'BỈ', meaningVi: 'Anh ấy', pos: 'Đại từ' },
          { id: '2', kanji: 'は', meaningVi: 'Chủ đề', pos: 'Trợ từ' },
          { id: '3', kanji: '医者', furigana: 'いしゃ', hanViet: 'Y GIẢ', meaningVi: 'Bác sĩ', pos: 'Danh từ' },
          { id: '4', kanji: 'じゃありません', meaningVi: 'Không phải là', pos: 'Phủ định' },
        ],
      },
    ],
  },
  {
    id: 'n5_kore_sore_are',
    levelId: 'n5',
    pattern: 'これ / それ / あれ は N です',
    meaningVi: 'Cái này / Cái đó / Cái kia là N (Chỉ thị từ)',
    formation: [
      {
        component: 'これ (gần người nói) / それ (gần người nghe) / あれ (xa cả hai) + は + N + です',
        explanationVi: 'Đại từ chỉ định đồ vật đứng độc lập làm chủ ngữ.',
        example: 'これ は ほん です (Cái này là quyển sách)',
      },
    ],
    nuanceBadges: [
      { label: '📍 Vị trí không gian', type: 'info' },
      { label: '👔 Căn bản', type: 'polite' },
    ],
    commonMistakes: [
      'Không nhầm với この/その/あの (phải đi liền trước danh từ: この本).',
    ],
    examples: [
      {
        japanese: 'これは 日本語の 本 です。',
        reading: 'これは にほんごの ほん です。',
        meaningVi: 'Cái này là sách tiếng Nhật.',
        tokens: [
          { id: '1', kanji: 'これ', meaningVi: 'Cái này', pos: 'Chỉ thị từ' },
          { id: '2', kanji: 'は', meaningVi: 'Là', pos: 'Trợ từ' },
          { id: '3', kanji: '日本語', furigana: 'にほんご', hanViet: 'NHẬT BẢN NGỮ', meaningVi: 'Tiếng Nhật', pos: 'Danh từ' },
          { id: '4', kanji: 'の', meaningVi: 'Của', pos: 'Trợ từ' },
          { id: '5', kanji: '本', furigana: 'ほん', hanViet: 'BỔN', meaningVi: 'Sách', pos: 'Danh từ' },
          { id: '6', kanji: 'です', meaningVi: 'Là', pos: 'Trợ động từ' },
        ],
      },
    ],
  },
  {
    id: 'n5_te_kudasai',
    levelId: 'n5',
    pattern: '〜てください',
    meaningVi: 'Xin hãy làm gì đó (Nhờ vả / Yêu cầu lịch sự)',
    formation: [
      {
        component: '[V-て] + ください',
        explanationVi: 'Chia động từ sang thể Te rồi thêm ください để nhờ vả đối phương thực hiện hành động.',
        example: 'かいて + ください ➔ かいてください (Xin hãy viết)',
      },
    ],
    nuanceBadges: [
      { label: '🙏 Nhờ vả lịch sự', type: 'polite' },
      { label: '🗣️ Phổ biến đời sống', type: 'spoken' },
    ],
    commonMistakes: [
      'Không dùng với người có địa vị cao hơn hoặc sếp trong bối cảnh cực kỳ trang trọng (thay bằng お願いいたします).',
    ],
    examples: [
      {
        japanese: 'ここに 名前を 書いてください。',
        reading: 'ここに なまえを かいてください。',
        meaningVi: 'Xin vui lòng viết tên vào đây.',
        tokens: [
          { id: '1', kanji: 'ここ', meaningVi: 'Ở đây', pos: 'Địa điểm' },
          { id: '2', kanji: 'に', meaningVi: 'Vào (nơi chốn)', pos: 'Trợ từ' },
          { id: '3', kanji: '名前', furigana: 'なまえ', hanViet: 'DANH TIỀN', meaningVi: 'Tên', pos: 'Danh từ' },
          { id: '4', kanji: 'を', meaningVi: 'Tân ngữ', pos: 'Trợ từ' },
          { id: '5', kanji: '書いてください', furigana: 'かいてください', hanViet: 'THƯ', meaningVi: 'Hãy viết', pos: 'Động từ' },
        ],
      },
    ],
  },
  {
    id: 'n5_te_wa_ikemasen',
    levelId: 'n5',
    pattern: '〜てはいけません',
    meaningVi: 'Không được phép làm gì (Cấm đoán mang tính quy tắc)',
    formation: [
      {
        component: '[V-て] + はいけません',
        explanationVi: 'Chuyển động từ sang thể Te rồi ghép với はいけません.',
        example: 'たべて + はいけません ➔ たべてはいけません (Không được ăn)',
      },
    ],
    nuanceBadges: [
      { label: '⛔ Cấm đoán/Quy tắc', type: 'warning' },
      { label: '👔 Lịch sự/Trang trọng', type: 'polite' },
      { label: '🗣️ Văn nói & Biển báo', type: 'spoken' },
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
    ],
  },
  {
    id: 'n5_te_mo_ii_desu',
    levelId: 'n5',
    pattern: '〜てもいいです',
    meaningVi: 'Làm gì đó cũng được / Được phép làm gì (Cho phép)',
    formation: [
      {
        component: '[V-て] + もいいです',
        explanationVi: 'Động từ thể Te + もいいです. Dùng để cho phép hoặc xin phép (dưới dạng câu hỏi 〜てもいいですか).',
        example: 'はいって + もいいです ➔ はいってもいいです (Được vào)',
      },
    ],
    nuanceBadges: [
      { label: '✅ Cho phép / Xin phép', type: 'polite' },
      { label: '🗣️ Giao tiếp đời sống', type: 'spoken' },
    ],
    commonMistakes: [
      'Khi xin phép người lớn tuổi, trả lời nên dùng はい、どうぞ thay vì lặp lại 〜てもいいです.',
    ],
    examples: [
      {
        japanese: 'ここで たばこを 吸ってもいいですか。',
        reading: 'ここで たばこを すってもいいですか。',
        meaningVi: 'Tôi có thể hút thuốc ở đây được không?',
        tokens: [
          { id: '1', kanji: 'ここ', meaningVi: 'Ở đây', pos: 'Địa điểm' },
          { id: '2', kanji: 'で', meaningVi: 'Tại', pos: 'Trợ từ' },
          { id: '3', kanji: 'たばこ', meaningVi: 'Thuốc lá', pos: 'Danh từ' },
          { id: '4', kanji: 'を', meaningVi: 'Tân ngữ', pos: 'Trợ từ' },
          { id: '5', kanji: '吸ってもいいですか', furigana: 'すってもいいですか', hanViet: 'HẤP', meaningVi: 'Có được hút không?', pos: 'Động từ' },
        ],
      },
    ],
  },
];

