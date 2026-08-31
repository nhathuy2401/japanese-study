import { makeAutoObservable } from 'mobx';
import { hapticService } from '../services/haptics/hapticService';

export interface MinedSentence {
  id: string;
  japanese: string;
  reading?: string;
  meaningVi: string;
  clozeTarget?: string;
  tags: string[];
  createdAt: string;
}

export class NotebookStore {
  savedSentences: MinedSentence[] = [
    {
      id: 'mine-1',
      japanese: 'そんな つもり じゃなかった のに...',
      reading: 'そんな つもり じゃなかった のに...',
      meaningVi: 'Tôi đâu có ý định làm thế đâu...',
      clozeTarget: 'つもり',
      tags: ['#N3', '#Tsumori', '#GiaoTiep'],
      createdAt: '2026-08-30',
    },
    {
      id: 'mine-2',
      japanese: '雨が 降る かもしれません。',
      reading: 'あめが ふる かもしれません。',
      meaningVi: 'Có thể trời sẽ mưa.',
      clozeTarget: 'かもしれません',
      tags: ['#N4', '#DuDoan'],
      createdAt: '2026-08-31',
    },
  ];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  addSentence(japanese: string, meaningVi: string, tags: string[] = ['#Mine']) {
    const newSentence: MinedSentence = {
      id: `mine-${Date.now()}`,
      japanese: japanese.trim(),
      meaningVi: meaningVi.trim(),
      tags,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.savedSentences.unshift(newSentence);
    hapticService.success();
  }

  setClozeTarget(id: string, word: string) {
    const target = this.savedSentences.find((s) => s.id === id);
    if (target) {
      target.clozeTarget = word;
      hapticService.light();
    }
  }

  removeSentence(id: string) {
    this.savedSentences = this.savedSentences.filter((s) => s.id !== id);
    hapticService.warning();
  }
}
