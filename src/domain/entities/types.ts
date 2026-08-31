export type FuriganaMode = 'always' | 'tap-to-reveal' | 'hidden';

export type PitchType = 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka';

export interface MoraPitch {
  mora: string;
  isHigh: boolean;
  number: number;
}

export interface PitchPattern {
  type: PitchType;
  pitchNumber: number; // e.g. 0 (heiban), 1 (atamadaka), 2/3 (nakadaka), etc.
  moras: MoraPitch[];
  audioSampleUri?: string;
}

export interface JapaneseToken {
  id: string;
  kanji?: string;
  furigana?: string;
  romaji?: string;
  hanViet?: string;
  pos?: string; // Part of speech (Danh từ, Trợ từ, Động từ...)
  meaningVi: string;
  pitchPattern?: PitchPattern;
}

export interface GrammarFormationRule {
  component: string; // e.g. "V-て", "N + で", "A-い"
  explanationVi: string;
  example: string;
}

export interface GrammarNuanceBadge {
  label: string; // "Cấm đoán", "Lịch sự", "Văn nói", "Văn viết"
  type: 'polite' | 'casual' | 'spoken' | 'written' | 'warning' | 'info';
}

export interface DomainGrammarPoint {
  id: string;
  levelId: string;
  pattern: string;
  meaningVi: string;
  formation: GrammarFormationRule[];
  nuanceBadges: GrammarNuanceBadge[];
  commonMistakes?: string[];
  examples: {
    japanese: string;
    reading?: string;
    meaningVi: string;
    tokens?: JapaneseToken[];
  }[];
}

export interface DomainKanji {
  id: string;
  character: string;
  levelId?: string;
  meaningsVi: string[];
  onyomi: string[];
  kunyomi: string[];
  radicals: {
    symbol: string;
    name: string;
    meaningVi: string;
  }[];
  strokeCount: number;
  mnemonic?: string;
  vocabCompounds: {
    expression: string;
    reading: string;
    meaningVi: string;
  }[];
}

export type SrsRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface SrsCardData {
  id: string;
  contentType: 'grammar' | 'kanji' | 'vocab' | 'cloze';
  contentId: string;
  cardType: string;
  dueAt: Date;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  state: 'new' | 'learning' | 'review' | 'relearning';
  lastReviewedAt?: Date;
  // Payload for rendering
  prompt: string;
  answer: string;
  reading?: string;
  extraInfo?: string;
  exampleSentence?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  isCompleted: boolean;
}
