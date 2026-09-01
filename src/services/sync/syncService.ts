import { doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { getFirestoreDb, isFirebaseConfigured } from '../firebase/firebaseConfig';
import { SrsCardData } from '../../domain/entities/types';

export interface UserSyncPayload {
  uid: string;
  settings: {
    furiganaMode: string;
    showRomaji: boolean;
    hapticsEnabled: boolean;
    isAiEnabled: boolean;
    updatedAt: string;
  };
  progress: {
    currentStreak: number;
    totalXp: number;
    updatedAt: string;
  };
  reviews?: SrsCardData[];
}

export interface SyncStatus {
  lastSyncedAt: Date | null;
  isSyncing: boolean;
  error: string | null;
}

export class SyncService {
  private lastSyncedAt: Date | null = null;
  private isSyncing = false;
  private lastError: string | null = null;

  getStatus(): SyncStatus {
    return {
      lastSyncedAt: this.lastSyncedAt,
      isSyncing: this.isSyncing,
      error: this.lastError,
    };
  }

  async syncToCloud(payload: UserSyncPayload): Promise<boolean> {
    if (!isFirebaseConfigured() || !payload.uid) {
      return false;
    }

    this.isSyncing = true;
    this.lastError = null;

    try {
      const db = getFirestoreDb();
      const userRef = doc(db, 'users', payload.uid);

      // 1. Lưu cài đặt & tiến độ vào users/{uid}
      await setDoc(
        userRef,
        {
          profile: {
            uid: payload.uid,
            lastSyncedAt: new Date().toISOString(),
          },
          settings: payload.settings,
          progress: payload.progress,
        },
        { merge: true }
      );

      // 2. Batch sync danh sách thẻ SRS nếu có
      if (payload.reviews && payload.reviews.length > 0) {
        const batch = writeBatch(db);
        payload.reviews.slice(0, 100).forEach((card) => {
          const cardRef = doc(db, 'users', payload.uid, 'reviews', card.id);
          batch.set(
            cardRef,
            {
              id: card.id,
              type: card.type,
              stability: card.stability,
              difficulty: card.difficulty,
              reps: card.reps,
              lapses: card.lapses,
              state: card.state,
              dueAt: card.dueAt.toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        });
        await batch.commit();
      }

      this.lastSyncedAt = new Date();
      this.isSyncing = false;
      console.log(`[SyncService] Đã đồng bộ thành công dữ liệu lên project study-2cf98`);
      return true;
    } catch (e: any) {
      console.error('[SyncService] Lỗi đồng bộ Firestore:', e);
      this.lastError = e.message || 'Lỗi đồng bộ dữ liệu';
      this.isSyncing = false;
      return false;
    }
  }

  async fetchFromCloud(uid: string): Promise<Partial<UserSyncPayload> | null> {
    if (!isFirebaseConfigured() || !uid) return null;

    try {
      const db = getFirestoreDb();
      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          uid,
          settings: data.settings,
          progress: data.progress,
        };
      }
      return null;
    } catch (e: any) {
      console.warn('[SyncService] Lỗi khi tải dữ liệu cloud từ study-2cf98:', e.message);
      return null;
    }
  }
}

export const syncService = new SyncService();
