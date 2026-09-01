import { curriculumService } from '../curriculum/curriculumService';
import { grammarService } from '../grammar/grammarService';
import { kanjiService } from '../kanji/kanjiService';
import { recordStudyActivity, INITIAL_STREAK_STATE } from '../../domain/streak/streak';
import { HIRAGANA_CHARACTERS, KATAKANA_CHARACTERS } from '../../data/kana/kanaData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type QuizQuestionType =
  | 'multiple-choice'
  | 'fill-in-blank'
  | 'furigana-reading'
  | 'sentence-scramble'
  | 'translation';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  subPrompt?: string;
  japaneseText?: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
  // Dành riêng cho sentence-scramble
  scrambledWords?: string[];
  correctWordOrder?: string[];
}

export interface QuizResult {
  unitId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  isPassed: boolean;
  xpEarned: number;
}

const QUIZ_HISTORY_STORAGE_KEY = 'nihongo-local:quiz-history:v1';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const quizService = {
  /**
   * Sinh bộ câu hỏi Quiz thông minh cho một Unit cụ thể (5 - 7 câu hỏi)
   */
  async generateUnitQuiz(unitId: string): Promise<QuizQuestion[]> {
    if (unitId === 'kana-quiz' || unitId === 'intro') {
      return this.generateKanaQuiz();
    }

    const unit = curriculumService.getUnitById(unitId);
    if (!unit) return [];

    const questions: QuizQuestion[] = [];

    // 1. Tải danh sách ngữ pháp và kanji liên quan trong Unit
    const grammarList: any[] = [];
    for (const l of unit.lessons) {
      if (l.grammarPointId) {
        const g = await grammarService.getGrammarPointById(l.grammarPointId);
        if (g) grammarList.push(g);
      }
    }

    const kanjiList: any[] = [];
    for (const l of unit.lessons) {
      if (l.kanjiId) {
        const k = await kanjiService.getKanjiById(l.kanjiId);
        if (k) kanjiList.push(k);
      }
    }

    // Nếu không tìm thấy ngữ pháp, dùng danh sách fallback
    if (grammarList.length === 0) {
      const fallbackList = await grammarService.getGrammarPointsByLevel(unit.levelId);
      grammarList.push(...fallbackList.slice(0, 5));
    }

    // 2. Sinh Câu hỏi Dạng 1: Trắc nghiệm ý nghĩa mẫu ngữ pháp
    grammarList.slice(0, 2).forEach((g, idx) => {
      const otherMeanings = grammarList
        .filter((other) => other.id !== g.id)
        .map((other) => other.meaningVi);

      const wrongOptions = shuffle(otherMeanings).slice(0, 3);
      // Bổ sung các phương án sai nếu thiếu
      const defaultDistractors = [
        'Hành động đang diễn ra tại thời điểm nói',
        'Lời khuyên nên hoặc không nên làm gì',
        'Biểu đạt khả năng có thể làm được',
        'Hành động xảy ra trước một mốc thời gian',
      ];
      while (wrongOptions.length < 3) {
        wrongOptions.push(defaultDistractors[wrongOptions.length]);
      }

      const options: QuizOption[] = shuffle([
        { id: 'opt-corr', text: g.meaningVi, isCorrect: true },
        { id: 'opt-w1', text: wrongOptions[0], isCorrect: false },
        { id: 'opt-w2', text: wrongOptions[1], isCorrect: false },
        { id: 'opt-w3', text: wrongOptions[2], isCorrect: false },
      ]);

      questions.push({
        id: `q-mc-${idx + 1}`,
        type: 'multiple-choice',
        prompt: `Mẫu ngữ pháp sau có ý nghĩa là gì?`,
        subPrompt: g.pattern,
        options: options,
        correctAnswer: g.meaningVi,
        explanation: `Mẫu ngữ pháp ${g.pattern}: ${g.meaningVi}. Cấu trúc: ${g.formation || 'Xem cấu trúc trong bài'}.`,
      });
    });

    // 3. Sinh Câu hỏi Dạng 2: Điền trợ từ / Mẫu câu vào chỗ trống
    grammarList.forEach((g, idx) => {
      if (questions.length >= 5) return;
      if (g.examples && g.examples.length > 0) {
        const ex = g.examples[0];
        const cleanPattern = g.pattern.replace(/^[〜~]/, '');

        if (cleanPattern && ex.japanese.includes(cleanPattern)) {
          const blankSentence = ex.japanese.replace(cleanPattern, '【 ___ 】');
          const distractorPatterns = ['〜てもいい', '〜てはいけません', '〜から', '〜ので', '〜まえに']
            .map((p) => p.replace(/^[〜~]/, ''))
            .filter((p) => p !== cleanPattern)
            .slice(0, 3);

          const options: QuizOption[] = shuffle([
            { id: 'opt-c', text: cleanPattern, isCorrect: true },
            { id: 'opt-w1', text: distractorPatterns[0], isCorrect: false },
            { id: 'opt-w2', text: distractorPatterns[1], isCorrect: false },
            { id: 'opt-w3', text: distractorPatterns[2], isCorrect: false },
          ]);

          questions.push({
            id: `q-fib-${idx + 1}`,
            type: 'fill-in-blank',
            prompt: 'Chọn phần khuyết đúng để hoàn thành câu:',
            japaneseText: blankSentence,
            subPrompt: `Ý nghĩa câu: "${ex.meaningVi}"`,
            options: options,
            correctAnswer: cleanPattern,
            explanation: `Câu hoàn chỉnh: ${ex.japanese} (${ex.meaningVi}). Mẫu ngữ pháp được sử dụng: ${g.pattern}.`,
          });
        }
      }
    });

    // 4. Sinh Câu hỏi Dạng 3: Cách đọc Furigana của chữ Kanji trong Unit
    kanjiList.slice(0, 2).forEach((k, idx) => {
      const reading = (k.kunyomi && k.kunyomi[0]) || (k.onyomi && k.onyomi[0]) || 'ひと';
      const cleanReading = reading.replace(/[.\-]/g, '');

      const distractorReadings = ['み', 'た', 'い', 'の', 'か', 'き', 'はな', 'やま']
        .filter((r) => r !== cleanReading)
        .slice(0, 3);

      const options: QuizOption[] = shuffle([
        { id: 'opt-corr', text: cleanReading, isCorrect: true },
        { id: 'opt-w1', text: distractorReadings[0], isCorrect: false },
        { id: 'opt-w2', text: distractorReadings[1], isCorrect: false },
        { id: 'opt-w3', text: distractorReadings[2], isCorrect: false },
      ]);

      questions.push({
        id: `q-kanji-${idx + 1}`,
        type: 'furigana-reading',
        prompt: `Cách đọc Furigana của chữ Hán sau là gì?`,
        subPrompt: `Chữ Kanji: 【 ${k.character} 】 (Nghĩa: ${(k.meaningsVi || []).slice(0, 2).join(', ')})`,
        options: options,
        correctAnswer: cleanReading,
        explanation: `Chữ 【${k.character}】 có cách đọc là "${cleanReading}". Nghĩa: ${(k.meaningsVi || []).join(', ')}.`,
      });
    });

    // 5. Sinh Câu hỏi Dạng 4: Sắp xếp câu (Sentence Scramble)
    const exWithTokens = grammarList.find((g) => g.examples && g.examples.length > 0);
    if (exWithTokens && exWithTokens.examples[0]) {
      const ex = exWithTokens.examples[0];
      const tokens = ex.tokens && ex.tokens.length >= 3
        ? ex.tokens.map((t: any) => t.kanji.trim()).filter(Boolean)
        : ex.japanese.split(/([、。 ]+)/).map((s: string) => s.trim()).filter(Boolean);

      if (tokens.length >= 3 && tokens.length <= 6) {
        questions.push({
          id: `q-scramble-1`,
          type: 'sentence-scramble',
          prompt: 'Chạm vào các từ bên dưới để ghép thành câu hoàn chỉnh:',
          subPrompt: `Dịch câu: "${ex.meaningVi}"`,
          scrambledWords: shuffle([...tokens]),
          correctWordOrder: tokens,
          options: [],
          correctAnswer: tokens.join(' '),
          explanation: `Câu hoàn chỉnh chuẩn ngữ pháp: ${ex.japanese}.`,
        });
      }
    }

    return questions.slice(0, 6);
  },

  /**
   * Đánh giá kết quả bài thi và cập nhật chuỗi học (Streak)
   */
  async submitQuizResult(
    unitId: string,
    totalQuestions: number,
    correctCount: number
  ): Promise<QuizResult> {
    const scorePercentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);
    const isPassed = scorePercentage >= 60;
    const xpEarned = isPassed ? 50 : 20;

    // Ghi nhận hoạt động học tập vào Streak
    try {
      const rawStreak = await AsyncStorage.getItem('nihongo-local:streak:v1');
      const prevState = rawStreak ? JSON.parse(rawStreak) : INITIAL_STREAK_STATE;
      const nextState = recordStudyActivity(prevState, new Date());
      await AsyncStorage.setItem('nihongo-local:streak:v1', JSON.stringify(nextState));
    } catch (err) {
      console.warn('[quizService] Không thể cập nhật streak:', err);
    }

    // Lưu lịch sử làm bài vào bộ nhớ máy
    try {
      const raw = await AsyncStorage.getItem(QUIZ_HISTORY_STORAGE_KEY);
      const history = raw ? JSON.parse(raw) : {};
      history[unitId] = {
        scorePercentage,
        isPassed,
        completedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(QUIZ_HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn('[quizService] Không thể lưu lịch sử quiz:', err);
    }

    return {
      unitId,
      totalQuestions,
      correctCount,
      scorePercentage,
      isPassed,
      xpEarned,
    };
  },

  /**
   * Lấy lịch sử làm bài thi của Unit
   */
  async getUnitQuizStatus(unitId: string): Promise<{ isPassed: boolean; score: number } | null> {
    try {
      const raw = await AsyncStorage.getItem(QUIZ_HISTORY_STORAGE_KEY);
      if (!raw) return null;
      const history = JSON.parse(raw);
      const data = history[unitId];
      if (data) {
        return { isPassed: !!data.isPassed, score: Number(data.scorePercentage) || 0 };
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Sinh bộ câu hỏi trắc nghiệm kiểm tra Bảng chữ cái Kana (10 câu)
   */
  async generateKanaQuiz(): Promise<QuizQuestion[]> {
    const questions: QuizQuestion[] = [];

    // 1. Dạng 1: Nhìn Hiragana -> Chọn Romaji (4 câu)
    const shuffledHira = shuffle(HIRAGANA_CHARACTERS);
    shuffledHira.slice(0, 4).forEach((k, idx) => {
      const wrongRomaji = shuffle(
        HIRAGANA_CHARACTERS.filter((o) => o.romaji !== k.romaji).map((o) => o.romaji)
      ).slice(0, 3);

      const options: QuizOption[] = shuffle([
        { id: 'opt-c', text: `/${k.romaji}/`, isCorrect: true },
        { id: 'opt-w1', text: `/${wrongRomaji[0]}/`, isCorrect: false },
        { id: 'opt-w2', text: `/${wrongRomaji[1]}/`, isCorrect: false },
        { id: 'opt-w3', text: `/${wrongRomaji[2]}/`, isCorrect: false },
      ]);

      questions.push({
        id: `q-kana-hira-${idx + 1}`,
        type: 'multiple-choice',
        prompt: `Chữ cái Hiragana sau phát âm là gì?`,
        subPrompt: `Ký tự: 【 ${k.char} 】`,
        options,
        correctAnswer: `/${k.romaji}/`,
        explanation: `Chữ Hiragana 【${k.char}】 có phiên âm Romaji là /${k.romaji}/. Mẹo nhớ: ${k.mnemonic}`,
      });
    });

    // 2. Dạng 2: Nhìn Katakana -> Chọn Romaji (2 câu)
    const shuffledKata = shuffle(KATAKANA_CHARACTERS);
    shuffledKata.slice(0, 2).forEach((k, idx) => {
      const wrongRomaji = shuffle(
        KATAKANA_CHARACTERS.filter((o) => o.romaji !== k.romaji).map((o) => o.romaji)
      ).slice(0, 3);

      const options: QuizOption[] = shuffle([
        { id: 'opt-c', text: `/${k.romaji}/`, isCorrect: true },
        { id: 'opt-w1', text: `/${wrongRomaji[0]}/`, isCorrect: false },
        { id: 'opt-w2', text: `/${wrongRomaji[1]}/`, isCorrect: false },
        { id: 'opt-w3', text: `/${wrongRomaji[2]}/`, isCorrect: false },
      ]);

      questions.push({
        id: `q-kana-kata-${idx + 1}`,
        type: 'multiple-choice',
        prompt: `Chữ cái Katakana sau phát âm là gì?`,
        subPrompt: `Ký tự: 【 ${k.char} 】`,
        options,
        correctAnswer: `/${k.romaji}/`,
        explanation: `Chữ Katakana 【${k.char}】 có phiên âm Romaji là /${k.romaji}/. Mẹo nhớ: ${k.mnemonic}`,
      });
    });

    // 3. Dạng 3: Chuyển đổi Hiragana sang Katakana tương ứng (2 câu)
    shuffledHira.slice(4, 6).forEach((h, idx) => {
      const matchingKata = KATAKANA_CHARACTERS.find((k) => k.romaji === h.romaji);
      if (matchingKata) {
        const wrongKata = shuffle(
          KATAKANA_CHARACTERS.filter((k) => k.romaji !== h.romaji).map((k) => k.char)
        ).slice(0, 3);

        const options: QuizOption[] = shuffle([
          { id: 'opt-c', text: matchingKata.char, isCorrect: true },
          { id: 'opt-w1', text: wrongKata[0], isCorrect: false },
          { id: 'opt-w2', text: wrongKata[1], isCorrect: false },
          { id: 'opt-w3', text: wrongKata[2], isCorrect: false },
        ]);

        questions.push({
          id: `q-kana-convert-${idx + 1}`,
          type: 'multiple-choice',
          prompt: `Chữ Hiragana sau tương ứng với chữ Katakana nào?`,
          subPrompt: `Ký tự: 【 ${h.char} 】 (Phát âm: /${h.romaji}/)`,
          options,
          correctAnswer: matchingKata.char,
          explanation: `Chữ Hiragana 【${h.char}】 và Katakana 【${matchingKata.char}】 đều có cùng cách đọc là /${h.romaji}/.`,
        });
      }
    });

    // 4. Dạng 4: Nhận diện từ vựng đơn giản (2 câu)
    const wordsWithKana = shuffledHira.filter((k) => k.sampleWords && k.sampleWords.length > 0);
    wordsWithKana.slice(0, 2).forEach((k, idx) => {
      const sw = k.sampleWords[0];
      const otherMeanings = shuffle(
        wordsWithKana.filter((other) => other.id !== k.id).map((other) => other.sampleWords[0].meaningVi)
      ).slice(0, 3);

      const options: QuizOption[] = shuffle([
        { id: 'opt-c', text: sw.meaningVi, isCorrect: true },
        { id: 'opt-w1', text: otherMeanings[0] || 'quả táo', isCorrect: false },
        { id: 'opt-w2', text: otherMeanings[1] || 'buổi sáng', isCorrect: false },
        { id: 'opt-w3', text: otherMeanings[2] || 'ngôi nhà', isCorrect: false },
      ]);

      questions.push({
        id: `q-kana-word-${idx + 1}`,
        type: 'multiple-choice',
        prompt: `Từ vựng tiếng Nhật sau có nghĩa là gì?`,
        subPrompt: `Từ: 【 ${sw.word} 】 (Đọc: ${sw.reading})`,
        options,
        correctAnswer: sw.meaningVi,
        explanation: `Từ 【${sw.word}】 (${sw.reading}) có nghĩa là "${sw.meaningVi}".`,
      });
    });

    return questions.slice(0, 10);
  },
};
