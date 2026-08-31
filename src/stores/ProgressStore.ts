import { makeAutoObservable } from 'mobx';
import { DailyQuest } from '../domain/entities/types';
import { SEED_DAILY_QUESTS } from '../db/seed/n5Data';
import { hapticService } from '../services/haptics/hapticService';

export class ProgressStore {
  currentStreak: number = 12;
  totalXp: number = 1450;
  level: string = 'N5';
  currentUnitId: string = 'n5-u2';
  currentLessonTitle: string = 'Bài 2: Trợ từ を (Tân ngữ)';
  dailyQuests: DailyQuest[] = SEED_DAILY_QUESTS;

  // Heatmap: Last 7 days (true = studied)
  weeklyActivity: { day: string; studied: boolean }[] = [
    { day: 'T2', studied: true },
    { day: 'T3', studied: true },
    { day: 'T4', studied: true },
    { day: 'T5', studied: true },
    { day: 'T6', studied: true },
    { day: 'T7', studied: true },
    { day: 'CN', studied: false }, // Today
  ];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  completeQuest(questId: string) {
    const quest = this.dailyQuests.find((q) => q.id === questId);
    if (quest && !quest.isCompleted) {
      quest.currentCount = quest.targetCount;
      quest.isCompleted = true;
      this.totalXp += quest.xpReward;
      hapticService.success();
    }
  }

  recordStudySession() {
    this.weeklyActivity[6].studied = true;
    this.currentStreak += 1;
  }

  get completedQuestsCount(): number {
    return this.dailyQuests.filter((q) => q.isCompleted).length;
  }
}
