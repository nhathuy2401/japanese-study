import { quizService } from '../quizService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

// Mock firebaseConfig
jest.mock('../../firebase/firebaseConfig', () => ({
  isFirebaseConfigured: jest.fn().mockReturnValue(false),
  getFirestoreDb: jest.fn().mockReturnValue({}),
}));

describe('QuizService', () => {
  it('should generate unit quiz questions for a valid unit', async () => {
    const questions = await quizService.generateUnitQuiz('n5-u1');
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);

    // Kiểm tra cấu trúc câu hỏi
    const q = questions[0];
    expect(q.id).toBeDefined();
    expect(q.prompt).toBeDefined();
    expect(q.correctAnswer).toBeDefined();
    expect(q.explanation).toBeDefined();
  });

  it('should calculate quiz score and pass status correctly', async () => {
    // 4 / 5 đúng = 80% -> Passed
    const resultPassed = await quizService.submitQuizResult('n5-u1', 5, 4);
    expect(resultPassed.scorePercentage).toBe(80);
    expect(resultPassed.isPassed).toBe(true);
    expect(resultPassed.xpEarned).toBe(50);

    // 2 / 5 đúng = 40% -> Failed
    const resultFailed = await quizService.submitQuizResult('n5-u1', 5, 2);
    expect(resultFailed.scorePercentage).toBe(40);
    expect(resultFailed.isPassed).toBe(false);
    expect(resultFailed.xpEarned).toBe(20);
  });

  it('should generate kana quiz questions with 10 questions', async () => {
    const questions = await quizService.generateUnitQuiz('kana-quiz');
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBe(10);
    expect(questions[0].options.length).toBe(4);
    expect(questions[0].options.some((o) => o.isCorrect)).toBe(true);
  });

  it('should generate unit quiz questions for Unit 2 without [object Object] and without duplicate options', async () => {
    const questions = await quizService.generateUnitQuiz('n5-u2');
    expect(questions.length).toBeGreaterThan(0);

    for (const q of questions) {
      // 1. Tuyệt đối không được chứa [object Object]
      expect(q.explanation).not.toContain('[object Object]');
      expect(q.prompt).not.toContain('[object Object]');
      if (q.subPrompt) expect(q.subPrompt).not.toContain('[object Object]');

      // 2. Các options trắc nghiệm phải hoàn toàn duy nhất (không trùng lặp text)
      if (q.options && q.options.length > 0) {
        const optionTexts = q.options.map((o) => o.text.trim());
        const uniqueTexts = new Set(optionTexts);
        expect(uniqueTexts.size).toBe(optionTexts.length);

        // 3. Phải có đúng 1 đáp án đúng
        const correctOptions = q.options.filter((o) => o.isCorrect);
        expect(correctOptions.length).toBe(1);

        // 4. Không được chứa placeholder "Mẫu ngữ pháp JLPT chuẩn"
        for (const opt of q.options) {
          expect(opt.text).not.toBe('Mẫu ngữ pháp JLPT chuẩn');
        }
      }
    }
  });

  it('should verify all units across N5 and N4 have clean explanations and unique options', async () => {
    const unitIds = ['n5-u1', 'n5-u2', 'n5-u3', 'n4-u1'];
    for (const unitId of unitIds) {
      const questions = await quizService.generateUnitQuiz(unitId);
      for (const q of questions) {
        expect(q.explanation).not.toContain('[object Object]');
        if (q.options && q.options.length > 0) {
          const texts = q.options.map((o) => o.text.trim());
          const uniqueTexts = new Set(texts);
          expect(uniqueTexts.size).toBe(texts.length);
        }
      }
    }
  });
});

