import { DomainKanji } from '../../domain/entities/types';

export const N3_KANJI_LIST: DomainKanji[] = [
  {
    id: 'k-n3-1',
    character: '関',
    levelId: 'n3',
    meaningsVi: ['Quan hệ', 'Cửa ải', 'Quan'],
    onyomi: ['KAN (かん)'],
    kunyomi: ['seki (せき)', 'kaka-waru (関わる)'],
    strokeCount: 14,
    radicals: [{ symbol: '門', name: 'Môn', meaningVi: 'Cửa cổng' }],
    mnemonic: 'Cánh cửa cổng (門) kiểm soát sự LIÊN QUAN qua lại giữa hai vùng.',
    vocabCompounds: [
      { expression: '関係', reading: 'かんけい', meaningVi: 'Mối quan hệ' },
      { expression: '関心', reading: 'かんしん', meaningVi: 'Sự quan tâm' },
      { expression: '玄関', reading: 'げんかん', meaningVi: 'Lối vào nhà / Tiền sảnh' },
    ],
  },
  {
    id: 'k-n3-2',
    character: '境',
    levelId: 'n3',
    meaningsVi: ['Biên giới', 'Hoàn cảnh', 'Cảnh'],
    onyomi: ['KYŌ (きょう)', 'KEI (けい)'],
    kunyomi: ['sakai (さかい)'],
    strokeCount: 14,
    radicals: [{ symbol: '土', name: 'Thổ', meaningVi: 'Đất' }],
    mnemonic: 'Vùng đất (土) nơi ánh sáng rọi xuống xác định RANH GIỚI và HOÀN CẢNH.',
    vocabCompounds: [
      { expression: '環境', reading: 'かんきょう', meaningVi: 'Môi trường' },
      { expression: '国境', reading: 'こっきょう', meaningVi: 'Biên giới quốc gia' },
    ],
  },
];

