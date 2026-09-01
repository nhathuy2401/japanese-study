import { CURRICULUM_UNITS, UnitData, LessonMeta } from '../../data/curriculum/curriculumData';
import { getFirestoreDb, isFirebaseConfigured } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const curriculumService = {
  async getUnitsByLevel(level: 'n5' | 'n4' | 'n3' | 'n2'): Promise<UnitData[]> {
    const localUnits = CURRICULUM_UNITS[level] || [];

    if (isFirebaseConfigured()) {
      try {
        const db = getFirestoreDb();
        const snap = await getDoc(doc(db, 'curriculum', level));
        if (snap.exists()) {
          const data = snap.data();
          if (data && Array.isArray(data.units) && data.units.length >= localUnits.length) {
            return data.units as UnitData[];
          }
        }
      } catch (e) {
        console.warn('[curriculumService] Lỗi tải curriculum từ Firestore:', e);
      }
    }

    return localUnits;
  },

  getAllUnits(): Record<string, UnitData[]> {
    return CURRICULUM_UNITS;
  },

  getUnitById(unitId: string): UnitData | null {
    for (const lvl of Object.keys(CURRICULUM_UNITS)) {
      const found = CURRICULUM_UNITS[lvl].find((u) => u.id === unitId);
      if (found) return found;
    }
    return null;
  },

  findLessonById(lessonId: string): LessonMeta | null {
    for (const lvl of Object.keys(CURRICULUM_UNITS)) {
      for (const unit of CURRICULUM_UNITS[lvl]) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
      }
    }
    return null;
  },
};
