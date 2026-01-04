import { useState, useEffect, useCallback } from 'react';
import { AppStorage, LearningGoals, Statistics, CardState } from '../types';
import {
  loadStorage,
  saveStorage,
  checkAndUpdateStreak,
} from '../utils/storage';

interface UseStorageReturn {
  storage: AppStorage;
  updateGoals: (goals: LearningGoals) => void;
  updateCardState: (cardState: CardState) => void;
  addLearnedKana: (kanaId: string) => void;
  updateStats: (updates: Partial<Statistics>) => void;
  incrementStats: (isNew: boolean, isCorrect: boolean) => void;
  resetData: () => void;
  reload: () => void;
}

export function useStorage(): UseStorageReturn {
  const [storage, setStorage] = useState<AppStorage>(() => {
    const initial = loadStorage();
    checkAndUpdateStreak();
    return loadStorage();
  });
  const reload = useCallback(() => {
    setStorage(loadStorage());
  }, []);
  useEffect(() => {
    const handleStorageChange = (): void => {
      reload();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [reload]);
  const updateGoals = useCallback((goals: LearningGoals) => {
    setStorage((prev) => {
      const updated = { ...prev, goals };
      saveStorage(updated);
      return updated;
    });
  }, []);
  const updateCardState = useCallback((cardState: CardState) => {
    setStorage((prev) => {
      const updated = {
        ...prev,
        cardStates: { ...prev.cardStates, [cardState.kanaId]: cardState },
      };
      saveStorage(updated);
      return updated;
    });
  }, []);
  const addLearnedKana = useCallback((kanaId: string) => {
    setStorage((prev) => {
      if (prev.learnedKanaIds.includes(kanaId)) {
        return prev;
      }
      const updated = {
        ...prev,
        learnedKanaIds: [...prev.learnedKanaIds, kanaId],
      };
      saveStorage(updated);
      return updated;
    });
  }, []);
  const updateStats = useCallback((updates: Partial<Statistics>) => {
    setStorage((prev) => {
      const updated = {
        ...prev,
        statistics: { ...prev.statistics, ...updates },
      };
      saveStorage(updated);
      return updated;
    });
  }, []);
  const incrementStats = useCallback((isNew: boolean, isCorrect: boolean) => {
    setStorage((prev) => {
      const today = new Date().toISOString().split('T')[0];
      const stats = { ...prev.statistics };
      if (stats.lastStudyDate !== today) {
        const last = stats.lastStudyDate ? new Date(stats.lastStudyDate) : null;
        const now = new Date(today);
        if (last) {
          const diffDays = Math.floor(
            (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
          );
          stats.streakDays = diffDays === 1 ? stats.streakDays + 1 : 1;
        } else {
          stats.streakDays = 1;
        }
        stats.todayNewLearned = 0;
        stats.todayReviewed = 0;
      }
      if (isNew) {
        stats.todayNewLearned += 1;
      } else {
        stats.todayReviewed += 1;
      }
      stats.totalReviews += 1;
      if (isCorrect) {
        stats.correctReviews += 1;
      }
      stats.lastStudyDate = today;
      const updated = { ...prev, statistics: stats };
      saveStorage(updated);
      return updated;
    });
  }, []);
  const resetData = useCallback(() => {
    localStorage.removeItem('kana-learning-app');
    setStorage(loadStorage());
  }, []);
  return {
    storage,
    updateGoals,
    updateCardState,
    addLearnedKana,
    updateStats,
    incrementStats,
    resetData,
    reload,
  };
}
