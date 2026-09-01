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
});
