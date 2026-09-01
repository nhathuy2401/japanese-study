import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyQuest } from '../domain/entities/types';
import { SEED_DAILY_QUESTS } from '../db/seed/n5Data';
import { hapticService } from '../services/haptics/hapticService';
import {
  StreakState,
  INITIAL_STREAK_STATE,
  recordStudyActivity,
  getDisplayStreak,
  getWeeklyActivity,
  WeeklyDayActivity,
  mergeStreakStates,
} from '../domain/streak/streak';
import { syncService } from '../services/sync/syncService';

const STREAK_STORAGE_KEY = '@nihongo_local_streak_state';
const XP_STORAGE_KEY = '@nihongo_local_total_xp';

export class ProgressStore {
  streakState: StreakState = { ...INITIAL_STREAK_STATE };
  totalXp: number = 0;
  level: string = 'N5';
  currentUnitId: string = 'n5-u2';
  currentLessonTitle: string = 'Bài 2: Trợ từ を (Tân ngữ)';
  dailyQuests: DailyQuest[] = SEED_DAILY_QUESTS;
  isHydrated: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    void this.hydrate();
  }

  // Khôi phục dữ liệu Streak & XP từ AsyncStorage
  async hydrate() {
    try {
      const [savedStreak, savedXp] = await Promise.all([
        AsyncStorage.getItem(STREAK_STORAGE_KEY),
        AsyncStorage.getItem(XP_STORAGE_KEY),
      ]);

      runInAction(() => {
        if (savedStreak) {
          try {
            const parsed = JSON.parse(savedStreak) as StreakState;
            this.streakState = parsed;
          } catch (e) {
            console.warn('[ProgressStore] Không thể parse streakState đã lưu:', e);
          }
        }
        if (savedXp) {
          const xp = parseInt(savedXp, 10);
          if (!isNaN(xp)) this.totalXp = xp;
        }
        this.isHydrated = true;
      });
    } catch (err) {
      console.warn('[ProgressStore] Lỗi hydrate AsyncStorage:', err);
      runInAction(() => {
        this.isHydrated = true;
      });
    }
  }

  private async persist() {
    try {
      await Promise.all([
        AsyncStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(this.streakState)),
        AsyncStorage.setItem(XP_STORAGE_KEY, String(this.totalXp)),
      ]);
    } catch (err) {
      console.warn('[ProgressStore] Lỗi lưu AsyncStorage:', err);
    }
  }

  // Streak hiển thị (tự động tính 0 nếu người dùng bỏ lỡ ngày hôm qua)
  get currentStreak(): number {
    return getDisplayStreak(this.streakState);
  }

  // 7 ngày hoạt động gần nhất kết thúc ở ngày hôm nay
  get weeklyActivity(): WeeklyDayActivity[] {
    return getWeeklyActivity(this.streakState.activityDays);
  }

  get completedQuestsCount(): number {
    return this.dailyQuests.filter((q) => q.isCompleted).length;
  }

  // Ghi nhận một hoạt động học hợp lệ trong ngày (Lesson, SRS, Pitch)
  recordStudyActivity(source: 'lesson' | 'srs' | 'pitch' = 'lesson') {
    const prevState = this.streakState;
    const nextState = recordStudyActivity(prevState, new Date());
    this.streakState = nextState;
    void this.persist();

    // Thêm XP thưởng nhẹ nhàng cho hoạt động
    if (source === 'lesson') {
      this.totalXp += 20;
    } else if (source === 'srs') {
      this.totalXp += 5;
    } else if (source === 'pitch') {
      this.totalXp += 15;
    }

    // Trigger sync nhẹ nhàng lên Firestore
    void syncService.syncToCloud({
      uid: 'local_user',
      settings: {
        furiganaMode: 'always',
        showRomaji: true,
        hapticsEnabled: true,
        isAiEnabled: true,
        updatedAt: new Date().toISOString(),
      },
      progress: {
        currentStreak: this.currentStreak,
        totalXp: this.totalXp,
        updatedAt: nextState.updatedAt,
      },
    });
  }

  // Tương thích ngược với các component cũ gọi recordStudySession
  recordStudySession() {
    this.recordStudyActivity('lesson');
  }

  completeQuest(questId: string) {
    const quest = this.dailyQuests.find((q) => q.id === questId);
    if (quest && !quest.isCompleted) {
      quest.currentCount = quest.targetCount;
      quest.isCompleted = true;
      this.totalXp += quest.xpReward;
      hapticService.success();
      void this.persist();
    }
  }

  // Hợp nhất dữ liệu Streak khi đăng nhập hoặc đồng bộ từ Cloud
  mergeCloudStreak(cloudState: StreakState) {
    this.streakState = mergeStreakStates(this.streakState, cloudState);
    void this.persist();
  }
}
