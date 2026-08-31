import { makeAutoObservable, runInAction } from 'mobx';
import { geminiService, WritingFeedback, GrammarExplainResponse } from '../services/ai/gemini';
import { hapticService } from '../services/haptics/hapticService';

export class AiStore {
  isSheetOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  // Feedback results
  writingFeedback: WritingFeedback | null = null;
  grammarExplanation: GrammarExplainResponse | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  openAiSheet() {
    this.isSheetOpen = true;
    this.errorMessage = null;
    hapticService.light();
  }

  closeAiSheet() {
    this.isSheetOpen = false;
  }

  async requestGrammarExplanation(pattern: string, level: string = 'N5') {
    this.isLoading = true;
    this.errorMessage = null;
    this.grammarExplanation = null;
    this.openAiSheet();

    try {
      const response = await geminiService.explainGrammar(pattern, level);
      runInAction(() => {
        this.grammarExplanation = response;
        this.isLoading = false;
      });
      hapticService.success();
    } catch (e: any) {
      runInAction(() => {
        this.errorMessage = e.message || 'Không thể lấy giải thích từ Gemini AI';
        this.isLoading = false;
      });
      hapticService.error();
    }
  }

  async checkSentenceWriting(sentence: string, targetGrammar: string, level: string = 'N5') {
    this.isLoading = true;
    this.errorMessage = null;
    this.writingFeedback = null;
    this.openAiSheet();

    try {
      const result = await geminiService.checkWriting(sentence, targetGrammar, level);
      runInAction(() => {
        this.writingFeedback = result;
        this.isLoading = false;
      });
      hapticService.success();
    } catch (e: any) {
      runInAction(() => {
        this.errorMessage = e.message || 'Không thể kiểm tra bài viết qua AI';
        this.isLoading = false;
      });
      hapticService.error();
    }
  }
}

