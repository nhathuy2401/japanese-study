export interface LessonMeta {
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

export const CURRICULUM_UNITS: Record<string, UnitData[]> = {
  n5: [
    {
      id: 'n5-u1',
      levelId: 'n5',
      title: 'Unit 1: Chào hỏi & Giới thiệu bản thân',
      description: 'Làm quen với trợ từ は, です, じゃありません và văn hóa cúi chào',
      sortOrder: 1,
      lessons: [
        {
          id: 'n5-u1-l1',
          title: 'Bài 1: Khẳng định N1 は N2 です',
          type: 'grammar',
          durationMinutes: 8,
          grammarPointId: 'n5_wa_desu',
          kanjiId: 'k-n5-1',
        },
        {
          id: 'n5-u1-l2',
          title: 'Bài 2: Phủ định 〜じゃありません',
          type: 'grammar',
          durationMinutes: 8,
          grammarPointId: 'n5_ja_arimasen',
          kanjiId: 'k-n5-2',
        },
      ],
    },
    {
      id: 'n5-u2',
      levelId: 'n5',
      title: 'Unit 2: Đồ vật, Địa điểm & Chỉ thị từ',
      description: 'Chỉ định từ これ, それ, あれ và mẫu hỏi vật thể',
      sortOrder: 2,
      lessons: [
        {
          id: 'n5-u2-l1',
          title: 'Bài 1: Chỉ thị từ これ・それ・あれ',
          type: 'grammar',
          durationMinutes: 8,
          grammarPointId: 'n5_kore_sore_are',
          kanjiId: 'k-n5-3',
        },
      ],
    },
    {
      id: 'n5-u3',
      levelId: 'n5',
      title: 'Unit 3: Thể て & Hành động cấm đoán, xin phép',
      description: 'Mẫu câu nhờ vả, xin phép và cấm đoán 〜てはいけません',
      sortOrder: 3,
      lessons: [
        {
          id: 'n5-u3-l1',
          title: 'Bài 1: Cấm đoán 〜てはいけません',
          type: 'grammar',
          durationMinutes: 10,
          grammarPointId: 'n5_te_wa_ikemasen',
          kanjiId: 'k-n5-4',
        },
        {
          id: 'n5-u3-l2',
          title: 'Bài 2: Cho phép 〜てもいいです',
          type: 'grammar',
          durationMinutes: 8,
          grammarPointId: 'n5_te_mo_ii_desu',
          kanjiId: 'k-n5-5',
        },
      ],
    },
  ],
  n4: [
    {
      id: 'n4-u1',
      levelId: 'n4',
      title: 'Unit 1: Tâm trạng & Biến đổi hành động',
      description: 'Thể hiện sự tiếc nuối 〜てしまう và độ khó/dễ thực hiện',
      sortOrder: 1,
      lessons: [
        {
          id: 'n4-u1-l1',
          title: 'Bài 1: Hối tiếc 〜てしまいました',
          type: 'grammar',
          durationMinutes: 10,
          grammarPointId: 'n4_te_shimau',
          kanjiId: 'k-n4-1',
        },
        {
          id: 'n4-u1-l2',
          title: 'Bài 2: Dễ và Khó 〜やすい・〜にくい',
          type: 'grammar',
          durationMinutes: 8,
          grammarPointId: 'n4_yasui_nikui',
          kanjiId: 'k-n4-2',
        },
      ],
    },
    {
      id: 'n4-u2',
      levelId: 'n4',
      title: 'Unit 2: Dự định tương lai & Vượt mức',
      description: 'Kế hoạch bản thân 〜ようと思う và trạng thái thái quá 〜すぎる',
      sortOrder: 2,
      lessons: [
        {
          id: 'n4-u2-l1',
          title: 'Bài 1: Quá mức 〜すぎる',
          type: 'grammar',
          durationMinutes: 8,
          grammarPointId: 'n4_sugiru',
          kanjiId: 'k-n4-3',
        },
        {
          id: 'n4-u2-l2',
          title: 'Bài 2: Dự định 〜ようと思っています',
          type: 'grammar',
          durationMinutes: 10,
          grammarPointId: 'n4_you_to_omou',
          kanjiId: 'k-n4-1',
        },
      ],
    },
  ],
  n3: [
    {
      id: 'n3-u1',
      levelId: 'n3',
      title: 'Unit 1: Phán đoán & Bác bỏ sắc bén',
      description: 'Bác bỏ dứt khoát 〜わけがない và suy luận chắc chắn 〜に違いない',
      sortOrder: 1,
      lessons: [
        {
          id: 'n3-u1-l1',
          title: 'Bài 1: Bác bỏ hoàn toàn 〜わけがない',
          type: 'grammar',
          durationMinutes: 12,
          grammarPointId: 'n3_wake_ga_nai',
          kanjiId: 'k-n3-1',
        },
        {
          id: 'n3-u1-l2',
          title: 'Bài 2: Chắc chắn 〜に違いない',
          type: 'grammar',
          durationMinutes: 10,
          grammarPointId: 'n3_ni_chigainai',
          kanjiId: 'k-n3-2',
        },
      ],
    },
    {
      id: 'n3-u2',
      levelId: 'n3',
      title: 'Unit 2: Văn bản học thuật & Báo chí',
      description: 'Chủ đề thảo luận chuyên sâu 〜に関して',
      sortOrder: 2,
      lessons: [
        {
          id: 'n3-u2-l1',
          title: 'Bài 1: Về vấn đề 〜に関する・〜に関して',
          type: 'grammar',
          durationMinutes: 10,
          grammarPointId: 'n3_ni_kanshite',
          kanjiId: 'k-n3-1',
        },
      ],
    },
  ],
  n2: [
    {
      id: 'n2-u1',
      levelId: 'n2',
      title: 'Unit 1: Biến đổi tự nhiên & Bắt buộc',
      description: 'Biến đổi tỷ lệ thuận 〜につれて và ép buộc bất đắc dĩ 〜ざるを得ない',
      sortOrder: 1,
      lessons: [
        {
          id: 'n2-u1-l1',
          title: 'Bài 1: Càng... càng... 〜につれて',
          type: 'grammar',
          durationMinutes: 12,
          grammarPointId: 'n2_ni_tsurete',
          kanjiId: 'k-n2-1',
        },
        {
          id: 'n2-u1-l2',
          title: 'Bài 2: Buộc phải làm 〜ざるを得ない',
          type: 'grammar',
          durationMinutes: 12,
          grammarPointId: 'n2_zaru_o_enai',
          kanjiId: 'k-n2-2',
        },
      ],
    },
    {
      id: 'n2-u2',
      levelId: 'n2',
      title: 'Unit 2: Cơ hội & Bước ngoặt lớn',
      description: 'Khởi đầu mới từ sự kiện trọng đại 〜を契機に',
      sortOrder: 2,
      lessons: [
        {
          id: 'n2-u2-l1',
          title: 'Bài 1: Nhân cơ hội / Bước ngoặt 〜を契機に',
          type: 'grammar',
          durationMinutes: 12,
          grammarPointId: 'n2_wo_keiki_ni',
          kanjiId: 'k-n2-1',
        },
      ],
    },
  ],
};

