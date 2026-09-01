import { DomainGrammarPoint } from '../../domain/entities/types';
import { N5_GRAMMAR_POINTS } from '../../data/grammar/n5Grammar';
import { N4_GRAMMAR_POINTS } from '../../data/grammar/n4Grammar';
import { N3_GRAMMAR_POINTS } from '../../data/grammar/n3Grammar';
import { N2_GRAMMAR_POINTS } from '../../data/grammar/n2Grammar';
import { getFirestoreDb, isFirebaseConfigured } from '../firebase/firebaseConfig';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';

let ALL_LOCAL_GRAMMAR: DomainGrammarPoint[] = [
  ...N5_GRAMMAR_POINTS,
  ...N4_GRAMMAR_POINTS,
  ...N3_GRAMMAR_POINTS,
  ...N2_GRAMMAR_POINTS,
];

try {
  const generatedGrammar = require('../../data/generated/all_grammar.json');
  if (Array.isArray(generatedGrammar) && generatedGrammar.length > 0) {
    const map = new Map<string, DomainGrammarPoint>();
    ALL_LOCAL_GRAMMAR.forEach((g) => map.set(g.id, g));
    generatedGrammar.forEach((g: DomainGrammarPoint) => map.set(g.id, g));
    ALL_LOCAL_GRAMMAR = Array.from(map.values());
  }
} catch (e) {
  // Dùng seed mặc định nếu chưa bundle JSON
}

export const grammarService = {
  // Lấy tất cả mẫu ngữ pháp theo Level (Local-First kết hợp Cloud Firestore)
  async getGrammarByLevel(level: 'n5' | 'n4' | 'n3' | 'n2'): Promise<DomainGrammarPoint[]> {
    const localMatches = ALL_LOCAL_GRAMMAR.filter((g) => g.levelId === level);

    if (isFirebaseConfigured()) {
      try {
        const db = getFirestoreDb();
        const q = query(collection(db, 'grammar_points'), where('level', '==', level));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const cloudPoints = snapshot.docs.map((d) => d.data() as DomainGrammarPoint);
          const map = new Map<string, DomainGrammarPoint>();
          localMatches.forEach((p) => map.set(p.id, p));
          cloudPoints.forEach((p) => map.set(p.id, p));
          return Array.from(map.values());
        }
      } catch (e) {
        console.warn('[grammarService] Không thể tải từ Firestore, sử dụng local cache:', e);
      }
    }

    return localMatches;
  },

  // Lấy chi tiết 1 mẫu ngữ pháp theo id
  async getGrammarPointById(id: string): Promise<DomainGrammarPoint | null> {
    const local = ALL_LOCAL_GRAMMAR.find((g) => g.id === id);
    if (local) return local;

    if (isFirebaseConfigured()) {
      try {
        const db = getFirestoreDb();
        const snap = await getDoc(doc(db, 'grammar_points', id));
        if (snap.exists()) {
          return snap.data() as DomainGrammarPoint;
        }
      } catch (e) {
        console.warn('[grammarService] Lỗi tải grammarPoint từ Firestore:', e);
      }
    }

    return null;
  },

  getAllLocalGrammar(): DomainGrammarPoint[] {
    return ALL_LOCAL_GRAMMAR;
  },
};
