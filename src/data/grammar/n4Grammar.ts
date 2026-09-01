import { DomainGrammarPoint } from '../../domain/entities/types';

export const N4_GRAMMAR_POINTS: DomainGrammarPoint[] = [
  {
    id: 'n4_te_shimau',
    levelId: 'n4',
    pattern: '〜てしまう / 〜ちゃう',
    meaningVi: 'Lỡ làm gì mất rồi (Hối tiếc) / Đã làm xong hoàn toàn',
    formation: [
      {
        component: '[V-て] + しまう',
        explanationVi: 'Diễn tả hành động hoàn tất trọn vẹn hoặc sự hối tiếc vì xảy ra ngoài ý muốn.',
        example: 'わすれて + しまいました ➔ わすれてしまいました (Lỡ quên mất rồi)',
      },
    ],
    nuanceBadges: [
      { label: '😢 Nuối tiếc / Ngoài ý muốn', type: 'warning' },
      { label: '🗣️ Khẩu ngữ (ちゃう)', type: 'spoken' },
    ],
    commonMistakes: [
      'Trong văn nói thân mật, 〜てしまう chuyển thành 〜ちゃう (たべちゃう), 〜でしまう chuyển thành 〜じゃう (のんじゃう).',
    ],
    examples: [
      {
        japanese: 'パスポートを 電車に 忘れてしまいました。',
        reading: 'パスポートを でんしゃに わすれてしまいました。',
        meaningVi: 'Tôi lỡ để quên hộ chiếu trên tàu mất rồi.',
        tokens: [
          { id: '1', kanji: 'パスポート', meaningVi: 'Hộ chiếu', pos: 'Danh từ' },
          { id: '2', kanji: 'を', meaningVi: 'Tân ngữ', pos: 'Trợ từ' },
          { id: '3', kanji: '電車', furigana: 'でんしゃ', hanViet: 'ĐIỆN XA', meaningVi: 'Tàu điện', pos: 'Danh từ' },
          { id: '4', kanji: 'に', meaningVi: 'Trên / Tại', pos: 'Trợ từ' },
          { id: '5', kanji: '忘れてしまいました', furigana: 'わすれてしまいました', hanViet: 'VONG', meaningVi: 'Lỡ quên mất', pos: 'Động từ' },
        ],
      },
    ],
  },
  {
    id: 'n4_yasui_nikui',
    levelId: 'n4',
    pattern: '〜やすい / 〜にくい',
    meaningVi: 'Dễ làm gì / Khó làm gì',
    formation: [
      {
        component: '[V-ます bỏ ます] + やすい / にくい',
        explanationVi: 'Ghép vào thân động từ Masu để biến thành tính từ đuôi i chỉ độ dễ hoặc khó thực hiện.',
        example: 'つかい(ます) + やすい ➔ つかいやすい (Dễ sử dụng)',
      },
    ],
    nuanceBadges: [
      { label: '⚙️ Tính chất / Đánh giá', type: 'info' },
      { label: '🗣️ Rất phổ biến', type: 'spoken' },
    ],
    commonMistakes: [
      'Sau khi ghép やすい/にくい, từ biến thành tính từ đuôi i (chia quá khứ là やすかった/にくかった).',
    ],
    examples: [
      {
        japanese: 'この ペンは とても 書きやすい です。',
        reading: 'この ペンは とても かきやすい です。',
        meaningVi: 'Cây bút này rất dễ viết.',
        tokens: [
          { id: '1', kanji: 'この', meaningVi: 'Này', pos: 'Chỉ thị' },
          { id: '2', kanji: 'ペン', meaningVi: 'Bút', pos: 'Danh từ' },
          { id: '3', kanji: 'は', meaningVi: 'Chủ đề', pos: 'Trợ từ' },
          { id: '4', kanji: 'とても', meaningVi: 'Rất', pos: 'Phó từ' },
          { id: '5', kanji: '書きやすい', furigana: 'かきやすい', hanViet: 'THƯ', meaningVi: 'Dễ viết', pos: 'Tính từ' },
          { id: '6', kanji: 'です', meaningVi: 'Là', pos: 'Trợ động từ' },
        ],
      },
    ],
  },
  {
    id: 'n4_sugiru',
    levelId: 'n4',
    pattern: '〜すぎる',
    meaningVi: 'Quá mức (Thái quá, thường mang nghĩa tiêu cực)',
    formation: [
      {
        component: '[V-ます bỏ ます / A-い bỏ い / A-な bỏ な] + すぎる',
        explanationVi: 'Diễn tả trạng thái hoặc hành động vượt quá giới hạn bình thường.',
        example: 'たべ(ます) + すぎる ➔ たべすぎる (Ăn quá nhiều)',
      },
    ],
    nuanceBadges: [
      { label: '⚠️ Vượt ngưỡng / Thái quá', type: 'warning' },
      { label: '🗣️ Đời sống hàng ngày', type: 'spoken' },
    ],
    commonMistakes: [
      'Tính từ đuôi い phải bỏ い (たかい ➔ たかすぎる).',
    ],
    examples: [
      {
        japanese: '昨夜 お酒を 飲みすぎました。',
        reading: 'ゆうべ おさけを のみすぎました。',
        meaningVi: 'Tối qua tôi đã uống quá nhiều rượu.',
        tokens: [
          { id: '1', kanji: '昨夜', furigana: 'ゆうべ', hanViet: 'TÁC DẠ', meaningVi: 'Tối qua', pos: 'Danh từ' },
          { id: '2', kanji: 'お酒', furigana: 'おさけ', hanViet: 'TỬU', meaningVi: 'Rượu', pos: 'Danh từ' },
          { id: '3', kanji: 'を', meaningVi: 'Tân ngữ', pos: 'Trợ từ' },
          { id: '4', kanji: '飲みすぎました', furigana: 'のみすぎました', hanViet: 'ẨM', meaningVi: 'Đã uống quá nhiều', pos: 'Động từ' },
        ],
      },
    ],
  },
  {
    id: 'n4_you_to_omou',
    levelId: 'n4',
    pattern: '〜ようと思う',
    meaningVi: 'Dự định làm gì (Ý định xuất phát từ bản thân)',
    formation: [
      {
        component: '[V-ý chí (Thể ý chí)] + と思う / と思っている',
        explanationVi: 'Thể ý chí (Ý hướng) + と思う. Nếu ý định đã nung nấu từ trước thì dùng と思っています.',
        example: 'いこう + とおもいます ➔ いこうと思います (Tôi định đi)',
      },
    ],
    nuanceBadges: [
      { label: '🎯 Ý định cá nhân', type: 'info' },
      { label: '👔 Lịch sự', type: 'polite' },
    ],
    commonMistakes: [
      'Không dùng 〜ようと思う cho hành động của người thứ 3 (phải dùng 〜ようと思っているようです hoặc 〜つもりらしい).',
    ],
    examples: [
      {
        japanese: '来年 日本へ 留学しようと 思っています。',
        reading: 'らいねん にほんへ りゅうがくしようと おもっています。',
        meaningVi: 'Tôi đang có dự định sang năm đi du học Nhật Bản.',
        tokens: [
          { id: '1', kanji: '来年', furigana: 'らいねん', hanViet: 'LAI NIÊN', meaningVi: 'Sang năm', pos: 'Danh từ' },
          { id: '2', kanji: '日本', furigana: 'にほん', hanViet: 'NHẬT BẢN', meaningVi: 'Nhật Bản', pos: 'Danh từ' },
          { id: '3', kanji: 'へ', meaningVi: 'Đến (hướng đi)', pos: 'Trợ từ' },
          { id: '4', kanji: '留学しようと', furigana: 'りゅうがくしようと', hanViet: 'LƯU HỌC', meaningVi: 'Định du học', pos: 'Động từ' },
          { id: '5', kanji: '思っています', furigana: 'おもっています', hanViet: 'TƯ', meaningVi: 'Đang nghĩ / Dự định', pos: 'Động từ' },
        ],
      },
    ],
  },
];

