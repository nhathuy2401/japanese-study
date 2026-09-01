import { DomainGrammarPoint } from '../../domain/entities/types';

export const N3_GRAMMAR_POINTS: DomainGrammarPoint[] = [
  {
    id: 'n3_wake_ga_nai',
    levelId: 'n3',
    pattern: '〜わけがない / 〜はずがない',
    meaningVi: 'Tuyệt đối không thể nào... / Chắc chắn không có lý nào...',
    formation: [
      {
        component: '[Thể thông thường (Futsuukei)] + わけがない (Na-adj: な + わけがない, N: の + わけがない)',
        explanationVi: 'Khẳng định dựa trên lý lẽ chắc chắn rằng điều đó không thể xảy ra.',
        example: 'そんなこと は できる + わけがない (Làm sao có thể làm được việc đó)',
      },
    ],
    nuanceBadges: [
      { label: '🛡️ Bác bỏ tuyệt đối', type: 'warning' },
      { label: '🗣️ Khẩu ngữ (わけない)', type: 'spoken' },
    ],
    commonMistakes: [
      'Khác với 〜ないはずです (mức độ dự đoán nhẹ hơn), わけがない mang tính phán đoán chủ quan và phủ nhận mạnh mẽ.',
    ],
    examples: [
      {
        japanese: 'こんな 難しい 問題、彼に 分かる わけがありません。',
        reading: 'こんな むずかしい もんだい、かれに わかる わけがありません。',
        meaningVi: 'Câu hỏi khó thế này, anh ấy làm sao mà hiểu được!',
        tokens: [
          { id: '1', kanji: 'こんな', meaningVi: 'Như thế này', pos: 'Chỉ thị' },
          { id: '2', kanji: '難しい', furigana: 'むずかしい', hanViet: 'NAN', meaningVi: 'Khó', pos: 'Tính từ' },
          { id: '3', kanji: '問題', furigana: 'もんだい', hanViet: 'VẤN ĐỀ', meaningVi: 'Câu hỏi / Vấn đề', pos: 'Danh từ' },
          { id: '4', kanji: '彼に', furigana: 'かれに', hanViet: 'BỈ', meaningVi: 'Với anh ấy', pos: 'Đại từ' },
          { id: '5', kanji: '分かる', furigana: 'わかる', hanViet: 'PHÂN', meaningVi: 'Hiểu', pos: 'Động từ' },
          { id: '6', kanji: 'わけがありません', meaningVi: 'Làm sao có lý nào', pos: 'Ngữ pháp' },
        ],
      },
    ],
  },
  {
    id: 'n3_ni_chigainai',
    levelId: 'n3',
    pattern: '〜に違いない',
    meaningVi: 'Chắc chắn là... / Nhất định là...',
    formation: [
      {
        component: '[Thể thông thường] + に違いない (Na-adj / N: không cần だ)',
        explanationVi: 'Thể hiện sự phán đoán với độ tin cậy cực kỳ cao của người nói.',
        example: 'かれ が はんにん にちがいない (Hắn ta chắc chắn là thủ phạm)',
      },
    ],
    nuanceBadges: [
      { label: '🔍 Khẳng định tự tin', type: 'info' },
      { label: '✍️ Văn viết & Nói', type: 'polite' },
    ],
    commonMistakes: [
      'Danh từ và Tính từ đuôi Na ghép trực tiếp với に違いない, không thêm だ.',
    ],
    examples: [
      {
        japanese: '明日の 試験は 合格する に違いない。',
        reading: 'あすの しけんは ごうかくする にちがいない。',
        meaningVi: 'Kỳ thi ngày mai tôi chắc chắn sẽ đỗ.',
        tokens: [
          { id: '1', kanji: '明日', furigana: 'あす', hanViet: 'MINH NHẬT', meaningVi: 'Ngày mai', pos: 'Danh từ' },
          { id: '2', kanji: 'の', meaningVi: 'Của', pos: 'Trợ từ' },
          { id: '3', kanji: '試験', furigana: 'しけん', hanViet: 'THÍ NGHIỆM', meaningVi: 'Kỳ thi', pos: 'Danh từ' },
          { id: '4', kanji: 'は', meaningVi: 'Chủ đề', pos: 'Trợ từ' },
          { id: '5', kanji: '合格する', furigana: 'ごうかくする', hanViet: 'HỢP CÁCH', meaningVi: 'Thi đỗ', pos: 'Động từ' },
          { id: '6', kanji: 'に違いない', furigana: 'にちがいない', hanViet: 'VI', meaningVi: 'Chắc chắn là', pos: 'Ngữ pháp' },
        ],
      },
    ],
  },
  {
    id: 'n3_ni_kanshite',
    levelId: 'n3',
    pattern: '〜に関して / 〜に関する N',
    meaningVi: 'Liên quan đến... / Về vấn đề...',
    formation: [
      {
        component: 'N + に関して / に関しては / に関する N',
        explanationVi: 'Trang trọng hơn 〜について, dùng nhiều trong tin tức, văn bản và thuyết trình.',
        example: 'この じけん にかんして (Liên quan đến vụ án này)',
      },
    ],
    nuanceBadges: [
      { label: '👔 Trang trọng / Báo chí', type: 'polite' },
      { label: '✍️ Văn bản học thuật', type: 'info' },
    ],
    commonMistakes: [
      'Khi bổ nghĩa cho danh từ phía sau, bắt buộc đổi thành に関する + N.',
    ],
    examples: [
      {
        japanese: '環境問題に 関する 記事を 読みました。',
        reading: 'かんきょうもんだいに かんする きじを よみました。',
        meaningVi: 'Tôi đã đọc bài báo liên quan đến vấn đề môi trường.',
        tokens: [
          { id: '1', kanji: '環境問題', furigana: 'かんきょうもんだい', hanViet: 'HOÀN CẢNH VẤN ĐỀ', meaningVi: 'Vấn đề môi trường', pos: 'Danh từ' },
          { id: '2', kanji: 'に関する', furigana: 'にかんする', hanViet: 'QUAN', meaningVi: 'Liên quan đến', pos: 'Ngữ pháp' },
          { id: '3', kanji: '記事', furigana: 'きじ', hanViet: 'KÍ SỰ', meaningVi: 'Bài báo', pos: 'Danh từ' },
          { id: '4', kanji: 'を', meaningVi: 'Tân ngữ', pos: 'Trợ từ' },
          { id: '5', kanji: '読みました', furigana: 'よみました', hanViet: 'ĐỘC', meaningVi: 'Đã đọc', pos: 'Động từ' },
        ],
      },
    ],
  },
];

