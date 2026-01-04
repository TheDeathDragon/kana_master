export type KanaType = 'hiragana' | 'katakana';

export type KanaGroup =
  | 'vowel'      // a, i, u, e, o
  | 'k'          // ka, ki, ku, ke, ko
  | 's'          // sa, shi, su, se, so
  | 't'          // ta, chi, tsu, te, to
  | 'n'          // na, ni, nu, ne, no
  | 'h'          // ha, hi, fu, he, ho
  | 'm'          // ma, mi, mu, me, mo
  | 'y'          // ya, yu, yo
  | 'r'          // ra, ri, ru, re, ro
  | 'w'          // wa, wo
  | 'nn'         // n
  | 'g'          // ga, gi, gu, ge, go (dakuten)
  | 'z'          // za, ji, zu, ze, zo (dakuten)
  | 'd'          // da, di, du, de, do (dakuten)
  | 'b'          // ba, bi, bu, be, bo (dakuten)
  | 'p'          // pa, pi, pu, pe, po (handakuten)
  | 'ky'         // kya, kyu, kyo (yoon)
  | 'sy'         // sha, shu, sho (yoon)
  | 'ty'         // cha, chu, cho (yoon)
  | 'ny'         // nya, nyu, nyo (yoon)
  | 'hy'         // hya, hyu, hyo (yoon)
  | 'my'         // mya, myu, myo (yoon)
  | 'ry'         // rya, ryu, ryo (yoon)
  | 'gy'         // gya, gyu, gyo (yoon)
  | 'zy'         // ja, ju, jo (yoon)
  | 'by'         // bya, byu, byo (yoon)
  | 'py';        // pya, pyu, pyo (yoon)

export interface Kana {
  id: string;
  character: string;
  romaji: string;
  type: KanaType;
  group: KanaGroup;
}

export interface CardState {
  kanaId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string;
}

export interface LearningGoals {
  dailyNewCards: number;
  dailyReviewLimit: number;
  kanaTypes: KanaType[];
  priorityGroups: KanaGroup[];
}

export interface Statistics {
  totalReviews: number;
  correctReviews: number;
  streakDays: number;
  lastStudyDate: string;
  todayNewLearned: number;
  todayReviewed: number;
}

export interface AppStorage {
  goals: LearningGoals;
  cardStates: Record<string, CardState>;
  statistics: Statistics;
  learnedKanaIds: string[];
}

export type StudyMode = 'flashcard' | 'quiz' | 'writing' | 'pairing';

export type ExtraStudyType = 'normal' | 'extra-new' | 'extra-review' | 'practice';

export type Page = 'home' | 'learn' | 'review' | 'settings';

export interface ReviewSession {
  cards: Kana[];
  currentIndex: number;
  mode: StudyMode;
  results: SessionResult[];
}

export interface SessionResult {
  kanaId: string;
  quality: number;
  isCorrect: boolean;
  timestamp: number;
}
