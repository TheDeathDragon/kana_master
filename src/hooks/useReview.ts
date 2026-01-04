import { useMemo } from 'react';
import { Kana, CardState, LearningGoals, KanaType } from '../types';
import { allKana, getKanaByType } from '../data/kana';
import { getDueCards, createInitialCardState } from '../utils/sm2';

interface UseReviewParams {
  goals: LearningGoals;
  cardStates: Record<string, CardState>;
  learnedKanaIds: string[];
  todayNewLearned: number;
  todayReviewed: number;
}

interface UseReviewReturn {
  dueCards: Kana[];
  newCards: Kana[];
  remainingNewToday: number;
  remainingReviewToday: number;
  totalLearned: number;
  totalKana: number;
  progressPercent: number;
}

export function useReview(params: UseReviewParams): UseReviewReturn {
  const { goals, cardStates, learnedKanaIds, todayNewLearned, todayReviewed } = params;
  const availableKana = useMemo(() => {
    const kanaList: Kana[] = [];
    for (const type of goals.kanaTypes) {
      kanaList.push(...getKanaByType(type));
    }
    if (goals.priorityGroups.length > 0) {
      return kanaList.filter((k) => goals.priorityGroups.includes(k.group));
    }
    return kanaList;
  }, [goals.kanaTypes, goals.priorityGroups]);
  const totalKana = useMemo(() => {
    let count = 0;
    for (const type of goals.kanaTypes as KanaType[]) {
      count += getKanaByType(type).length;
    }
    return count;
  }, [goals.kanaTypes]);
  const dueCards = useMemo(() => {
    const states = Object.values(cardStates).filter((state) => {
      const kana = allKana.find((k) => k.id === state.kanaId);
      if (!kana) return false;
      if (!goals.kanaTypes.includes(kana.type)) return false;
      return true;
    });
    const due = getDueCards(states);
    const dueKana: Kana[] = [];
    for (const state of due) {
      const kana = allKana.find((k) => k.id === state.kanaId);
      if (kana) {
        dueKana.push(kana);
      }
    }
    return dueKana;
  }, [cardStates, goals.kanaTypes]);
  const newCards = useMemo(() => {
    return availableKana.filter((kana) => !learnedKanaIds.includes(kana.id));
  }, [availableKana, learnedKanaIds]);
  const remainingNewToday = Math.max(0, goals.dailyNewCards - todayNewLearned);
  const remainingReviewToday = Math.max(0, goals.dailyReviewLimit - todayReviewed);
  const totalLearned = learnedKanaIds.filter((id) => {
    const kana = allKana.find((k) => k.id === id);
    if (!kana) return false;
    return goals.kanaTypes.includes(kana.type);
  }).length;
  const progressPercent = totalKana > 0 ? Math.round((totalLearned / totalKana) * 100) : 0;
  return {
    dueCards,
    newCards,
    remainingNewToday,
    remainingReviewToday,
    totalLearned,
    totalKana,
    progressPercent,
  };
}

export function getCardsForSession(
  dueCards: Kana[],
  newCards: Kana[],
  remainingNewToday: number,
  remainingReviewToday: number
): Kana[] {
  const reviewCards = dueCards.slice(0, remainingReviewToday);
  const learnCards = newCards.slice(0, remainingNewToday);
  const combined = [...reviewCards, ...learnCards];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}

export function getLearnedCards(
  learnedKanaIds: string[],
  goals: LearningGoals
): Kana[] {
  const learnedCards: Kana[] = [];
  for (const id of learnedKanaIds) {
    const kana = allKana.find((k) => k.id === id);
    if (kana && goals.kanaTypes.includes(kana.type)) {
      learnedCards.push(kana);
    }
  }
  return learnedCards;
}

export { createInitialCardState };
