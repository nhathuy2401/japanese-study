import { DomainKanji } from '../../domain/entities/types';
import { N5_KANJI_LIST } from '../../data/kanji/n5Kanji';
import { N4_KANJI_LIST } from '../../data/kanji/n4Kanji';
import { N3_KANJI_LIST } from '../../data/kanji/n3Kanji';
import { N2_KANJI_LIST } from '../../data/kanji/n2Kanji';
import { getFirestoreDb, isFirebaseConfigured } from '../firebase/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';

let ALL_LOCAL_KANJI: DomainKanji[] = [
  ...N5_KANJI_LIST,
  ...N4_KANJI_LIST,
  ...N3_KANJI_LIST,
  ...N2_KANJI_LIST,
];

try {
  const generatedKanji = require('../../data/generated/all_kanji.json');
  if (Array.isArray(generatedKanji) && generatedKanji.length > 0) {
    const map = new Map<string, DomainKanji>();
    ALL_LOCAL_KANJI.forEach((k) => map.set(k.character, k));
    generatedKanji.forEach((k: DomainKanji) => map.set(k.character, k));
    ALL_LOCAL_KANJI = Array.from(map.values());
  }
} catch (e) {
  // Dùng seed mặc định nếu chưa bundle JSON
}

export const kanjiService = {
  async getKanjiByLevel(level: 'n5' | 'n4' | 'n3' | 'n2'): Promise<DomainKanji[]> {
    const localMatches = ALL_LOCAL_KANJI.filter((k) => k.levelId === level);

    if (isFirebaseConfigured()) {
      try {
        const db = getFirestoreDb();
        const q = query(collection(db, 'kanji_dict'), where('level', '==', level));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const cloudKanji = snapshot.docs.map((d) => d.data() as DomainKanji);
          const map = new Map<string, DomainKanji>();
          localMatches.forEach((k) => map.set(k.character, k));
          cloudKanji.forEach((k) => map.set(k.character, k));
          return Array.from(map.values());
        }
      } catch (e) {
        console.warn('[kanjiService] Lỗi tải từ Firestore, dùng local cache:', e);
      }
    }

    return localMatches;
  },

  async getKanjiById(idOrChar: string): Promise<DomainKanji | null> {
    const local = ALL_LOCAL_KANJI.find(
      (k) => k.id === idOrChar || k.character === idOrChar
    );
    if (local) return local;

    if (isFirebaseConfigured()) {
      try {
        const db = getFirestoreDb();
        const snap = await getDoc(doc(db, 'kanji_dict', idOrChar));
        if (snap.exists()) {
          return snap.data() as DomainKanji;
        }
      } catch (e) {
        console.warn('[kanjiService] Lỗi tải kanji từ Firestore:', e);
      }
    }

    return null;
  },

  getAllLocalKanji(): DomainKanji[] {
    return ALL_LOCAL_KANJI;
  },
};
