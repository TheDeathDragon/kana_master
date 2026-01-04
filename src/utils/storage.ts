import { AppStorage, CardState, LearningGoals, Statistics } from '../types';

const STORAGE_KEY = 'kana-learning-app';

const defaultGoals: LearningGoals = {
  dailyNewCards: 10,
  dailyReviewLimit: 50,
  kanaTypes: ['hiragana'],
  priorityGroups: ['vowel', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'nn'],
};

const defaultStatistics: Statistics = {
  totalReviews: 0,
  correctReviews: 0,
  streakDays: 0,
  lastStudyDate: '',
  todayNewLearned: 0,
  todayReviewed: 0,
};

function getDefaultStorage(): AppStorage {
  return {
    goals: defaultGoals,
    cardStates: {},
    statistics: defaultStatistics,
    learnedKanaIds: [],
  };
}

export function loadStorage(): AppStorage {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return getDefaultStorage();
    }
    const parsed = JSON.parse(data) as Partial<AppStorage>;
    return {
      goals: { ...defaultGoals, ...parsed.goals },
      cardStates: parsed.cardStates ?? {},
      statistics: { ...defaultStatistics, ...parsed.statistics },
      learnedKanaIds: parsed.learnedKanaIds ?? [],
    };
  } catch {
    return getDefaultStorage();
  }
}

export function saveStorage(storage: AppStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (err) {
    console.error('Failed to save storage:', err);
  }
}

export function updateGoals(goals: LearningGoals): void {
  const storage = loadStorage();
  storage.goals = goals;
  saveStorage(storage);
}

export function updateCardState(cardState: CardState): void {
  const storage = loadStorage();
  storage.cardStates[cardState.kanaId] = cardState;
  saveStorage(storage);
}

export function getCardState(kanaId: string): CardState | undefined {
  const storage = loadStorage();
  return storage.cardStates[kanaId];
}

export function addLearnedKana(kanaId: string): void {
  const storage = loadStorage();
  if (!storage.learnedKanaIds.includes(kanaId)) {
    storage.learnedKanaIds.push(kanaId);
    saveStorage(storage);
  }
}

export function isKanaLearned(kanaId: string): boolean {
  const storage = loadStorage();
  return storage.learnedKanaIds.includes(kanaId);
}

export function updateStatistics(updates: Partial<Statistics>): void {
  const storage = loadStorage();
  storage.statistics = { ...storage.statistics, ...updates };
  saveStorage(storage);
}

export function checkAndUpdateStreak(): void {
  const storage = loadStorage();
  const today = new Date().toISOString().split('T')[0];
  const lastDate = storage.statistics.lastStudyDate;
  if (!lastDate) {
    storage.statistics.streakDays = 1;
    storage.statistics.lastStudyDate = today;
    storage.statistics.todayNewLearned = 0;
    storage.statistics.todayReviewed = 0;
  } else if (lastDate === today) {
    return;
  } else {
    const last = new Date(lastDate);
    const now = new Date(today);
    const diffDays = Math.floor(
      (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      storage.statistics.streakDays += 1;
    } else {
      storage.statistics.streakDays = 1;
    }
    storage.statistics.lastStudyDate = today;
    storage.statistics.todayNewLearned = 0;
    storage.statistics.todayReviewed = 0;
  }
  saveStorage(storage);
}

export function incrementTodayStats(isNew: boolean, isCorrect: boolean): void {
  const storage = loadStorage();
  const today = new Date().toISOString().split('T')[0];
  if (storage.statistics.lastStudyDate !== today) {
    checkAndUpdateStreak();
  }
  if (isNew) {
    storage.statistics.todayNewLearned += 1;
  } else {
    storage.statistics.todayReviewed += 1;
  }
  storage.statistics.totalReviews += 1;
  if (isCorrect) {
    storage.statistics.correctReviews += 1;
  }
  storage.statistics.lastStudyDate = today;
  saveStorage(storage);
}

export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
