import { DomainKanji } from '../../domain/entities/types';

export const N4_KANJI_LIST: DomainKanji[] = [
  {
    id: 'k-n4-1',
    character: '旅',
    levelId: 'n4',
    meaningsVi: ['Du lịch', 'Hành trình', 'Lữ'],
    onyomi: ['RYO (りょ)'],
    kunyomi: ['tabi (たび)'],
    strokeCount: 10,
    radicals: [{ symbol: '方', name: 'Phương', meaningVi: 'Phương hướng' }],
    mnemonic: 'Đoàn người vác cờ (方) lên đường đi DU LỊCH khắp bốn phương.',
    vocabCompounds: [
      { expression: '旅行', reading: 'りょこう', meaningVi: 'Chuyến du lịch' },
      { expression: '一人旅', reading: 'ひとりたび', meaningVi: 'Du lịch một mình' },
      { expression: '旅館', reading: 'りょかん', meaningVi: 'Nhà trọ kiểu Nhật' },
    ],
  },
  {
    id: 'k-n4-2',
    character: '館',
    levelId: 'n4',
    meaningsVi: ['Tòa nhà lớn', 'Quán', 'Viện'],
    onyomi: ['KAN (かん)'],
    kunyomi: ['yakata (やかた)'],
    strokeCount: 16,
    radicals: [{ symbol: '飠', name: 'Thực', meaningVi: 'Ăn uống' }],
    mnemonic: 'Tòa nhà to lớn nơi quan khách đến ăn uống (飠) và nghỉ ngơi.',
    vocabCompounds: [
      { expression: '図書館', reading: 'としょかん', meaningVi: 'Thư viện' },
      { expression: '美術館', reading: 'びじゅつかん', meaningVi: 'Bảo tàng mỹ thuật' },
      { expression: '映画館', reading: 'えいがかん', meaningVi: 'Rạp chiếu phim' },
    ],
  },
  {
    id: 'k-n4-3',
    character: '試',
    levelId: 'n4',
    meaningsVi: ['Thử nghiệm', 'Thí'],
    onyomi: ['SHI (し)'],
    kunyomi: ['tame-su (試す)', 'kokoro-miru (試みる)'],
    strokeCount: 13,
    radicals: [
      { symbol: '言', name: 'Ngôn', meaningVi: 'Lời nói' },
      { symbol: '式', name: 'Thức', meaningVi: 'Kiểu mẫu' },
    ],
    mnemonic: 'Dùng lời nói (言) theo đúng quy tắc (式) để làm bài THI KIỂM TRA.',
    vocabCompounds: [
      { expression: '試験', reading: 'しけん', meaningVi: 'Kỳ thi' },
      { expression: '試合', reading: 'しあい', meaningVi: 'Trận đấu' },
    ],
  },
];

