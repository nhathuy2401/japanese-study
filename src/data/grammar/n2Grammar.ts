import { DomainGrammarPoint } from '../../domain/entities/types';

export const N2_GRAMMAR_POINTS: DomainGrammarPoint[] = [
  {
    id: 'n2_ni_tsurete',
    levelId: 'n2',
    pattern: '〜につれて / 〜にしたがって',
    meaningVi: 'Càng... thì càng... (Biến đổi tỷ lệ thuận cùng chiều)',
    formation: [
      {
        component: '[V-từ điển / N chỉ sự biến đổi] + につれて',
        explanationVi: 'Diễn tả sự thay đổi của một vế kéo theo sự thay đổi tương ứng của vế sau.',
        example: 'じかん が たつ + につれて (Thời gian càng trôi qua thì...)',
      },
    ],
    nuanceBadges: [
      { label: '📈 Biến đổi tự nhiên', type: 'info' },
      { label: '✍️ Văn viết & Báo chí', type: 'polite' },
    ],
    commonMistakes: [
      'Vế sau của 〜につれて phải là sự biến đổi tự nhiên dần dần, không dùng cho hành động có chủ ý của người nói.',
    ],
    examples: [
      {
        japanese: '年を 取るに つれて、健康の 大切さが 分かる。',
        reading: 'としを とるに つれて、けんこうの たいせつさが わかる。',
        meaningVi: 'Càng có tuổi thì người ta càng thấm thía tầm quan trọng của sức khỏe.',
        tokens: [
          { id: '1', kanji: '年を取る', furigana: 'としをとる', hanViet: 'NIÊN THỦ', meaningVi: 'Có tuổi / Già đi', pos: 'Cụm từ' },
          { id: '2', kanji: 'につれて', meaningVi: 'Càng... càng...', pos: 'Ngữ pháp' },
          { id: '3', kanji: '健康', furigana: 'けんこう', hanViet: 'KIỆN KHANG', meaningVi: 'Sức khỏe', pos: 'Danh từ' },
          { id: '4', kanji: 'の', meaningVi: 'Của', pos: 'Trợ từ' },
          { id: '5', kanji: '大切さ', furigana: 'たいせつさ', hanViet: 'ĐẠI THIẾT', meaningVi: 'Tầm quan trọng', pos: 'Danh từ' },
          { id: '6', kanji: 'が', meaningVi: 'Chủ ngữ', pos: 'Trợ từ' },
          { id: '7', kanji: '分かる', furigana: 'わかる', hanViet: 'PHÂN', meaningVi: 'Hiểu ra / Thấu hiểu', pos: 'Động từ' },
        ],
      },
    ],
  },
  {
    id: 'n2_zaru_o_enai',
    levelId: 'n2',
    pattern: '〜ざるを得ない',
    meaningVi: 'Đành phải... / Buộc phải... (Không muốn nhưng không còn cách nào khác)',
    formation: [
      {
        component: '[V-nai bỏ ない] + ざるを得ない (Đặc biệt: する ➔ せざるを得ない)',
        explanationVi: 'Diễn tả tình huống ép buộc về mặt hoàn cảnh hoặc lý trí, dù không muốn vẫn phải làm.',
        example: 'あきらめ(ない) + ざるをえない ➔ あきらめざるを得ない (Đành phải bỏ cuộc)',
      },
    ],
    nuanceBadges: [
      { label: '😣 Bất đắc dĩ / Ép buộc', type: 'warning' },
      { label: '✍️ Trang trọng / Học thuật', type: 'polite' },
    ],
    commonMistakes: [
      'Động từ nhóm 3 する chia thành せざるを得ない (không phải しざるを得ない).',
    ],
    examples: [
      {
        japanese: '台風のため、旅行は 中止せざるを得ない。',
        reading: 'たいふうのため、りょこうは ちゅうしせざるをえない。',
        meaningVi: 'Do bão nên đành phải hủy chuyến du lịch.',
        tokens: [
          { id: '1', kanji: '台風', furigana: 'たいふう', hanViet: 'THAI PHONG', meaningVi: 'Bão', pos: 'Danh từ' },
          { id: '2', kanji: 'のため', meaningVi: 'Vì lý do', pos: 'Trợ từ' },
          { id: '3', kanji: '旅行', furigana: 'りょこう', hanViet: 'LỮ HÀNH', meaningVi: 'Chuyến du lịch', pos: 'Danh từ' },
          { id: '4', kanji: 'は', meaningVi: 'Chủ đề', pos: 'Trợ từ' },
          { id: '5', kanji: '中止せざるを得ない', furigana: 'ちゅうしせざるをえない', hanViet: 'TRUNG CHỈ ĐẮC', meaningVi: 'Đành phải hủy', pos: 'Động từ' },
        ],
      },
    ],
  },
  {
    id: 'n2_wo_keiki_ni',
    levelId: 'n2',
    pattern: '〜を契機に（して） / 〜をきっかけに',
    meaningVi: 'Nhân dịp... / Nhân cơ hội... (Bước ngoặt tạo ra sự thay đổi lớn)',
    formation: [
      {
        component: 'N + を契機に / を契機として',
        explanationVi: 'Dùng khi một sự kiện mang tính bước ngoặt xảy ra và mở ra chuỗi hành động hay sự thay đổi lớn sau đó.',
        example: 'てんしょく を けいき に (Nhân cơ hội chuyển việc)',
      },
    ],
    nuanceBadges: [
      { label: '🚀 Bước ngoặt / Khởi đầu mới', type: 'info' },
      { label: '✍️ Văn viết chính thống', type: 'polite' },
    ],
    commonMistakes: [
      'を契機に mang sắc thái trang trọng, lịch sự và tích cực hơn so với をきっかけに.',
    ],
    examples: [
      {
        japanese: '卒業を 契機に、一人暮らしを 始めた。',
        reading: 'そつぎょうを けいきに、ひとりぐらしを はじめた。',
        meaningVi: 'Nhân dịp tốt nghiệp, tôi đã bắt đầu cuộc sống tự lập một mình.',
        tokens: [
          { id: '1', kanji: '卒業', furigana: 'そつぎょう', hanViet: 'TỐT NGHIỆP', meaningVi: 'Tốt nghiệp', pos: 'Danh từ' },
          { id: '2', kanji: 'を契機に', furigana: 'をけいきに', hanViet: 'KHẾ CƠ', meaningVi: 'Nhân dịp / Nhân bước ngoặt', pos: 'Ngữ pháp' },
          { id: '3', kanji: '一人暮らし', furigana: 'ひとりぐらし', hanViet: 'NHẤT NHÂN MỘ', meaningVi: 'Sống một mình', pos: 'Danh từ' },
          { id: '4', kanji: 'を', meaningVi: 'Tân ngữ', pos: 'Trợ từ' },
          { id: '5', kanji: '始めた', furigana: 'はじめた', hanViet: 'THỦY', meaningVi: 'Đã bắt đầu', pos: 'Động từ' },
        ],
      },
    ],
  },
];

