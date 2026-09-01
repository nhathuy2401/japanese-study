import { DomainKanji } from '../../domain/entities/types';

export const N2_KANJI_LIST: DomainKanji[] = [
  {
    id: 'k-n2-1',
    character: '契',
    levelId: 'n2',
    meaningsVi: ['Hợp đồng', 'Giao ước', 'Khế'],
    onyomi: ['KEI (けい)'],
    kunyomi: ['chigi-ru (契る)'],
    strokeCount: 9,
    radicals: [{ symbol: '大', name: 'Đại', meaningVi: 'To lớn' }],
    mnemonic: 'Dùng dao khắc giao ước to lớn (大) để làm HỢP ĐỒNG KHẾ ƯỚC.',
    vocabCompounds: [
      { expression: '契約', reading: 'けいやく', meaningVi: 'Hợp đồng' },
      { expression: '契機', reading: 'けいき', meaningVi: 'Thời cơ / Bước ngoặt' },
    ],
  },
  {
    id: 'k-n2-2',
    character: '机',
    levelId: 'n2',
    meaningsVi: ['Bàn học', 'Cơ'],
    onyomi: ['KI (き)'],
    kunyomi: ['tsukue (つくえ)'],
    strokeCount: 6,
    radicals: [{ symbol: '木', name: 'Mộc', meaningVi: 'Gỗ' }],
    mnemonic: 'Cái bàn làm từ cây gỗ (木) để ngồi làm việc.',
    vocabCompounds: [
      { expression: '机', reading: 'つくえ', meaningVi: 'Bàn' },
      { expression: '契機', reading: 'けいき', meaningVi: 'Bước ngoặt' },
    ],
  },
];

