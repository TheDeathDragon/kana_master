import React, { useState, useEffect } from 'react';
import { StudyMode, Kana, ExtraStudyType } from '../types';
import { FlashCard } from '../components/FlashCard';
import { QuizMode } from '../components/QuizMode';
import { WritingMode } from '../components/WritingMode';
import { PairingMode } from '../components/PairingMode';
import { useStorage } from '../hooks/useStorage';
import { useLanguage } from '../hooks/useLanguage';
import { useReview, getCardsForSession, getLearnedCards, createInitialCardState } from '../hooks/useReview';
import { calculateNextReview } from '../utils/sm2';
import styles from './Study.module.css';

const EXTRA_CARDS_COUNT = 5;

interface StudyProps {
  mode: StudyMode;
  extraType: ExtraStudyType;
  onExit: () => void;
}

export function Study({ mode, extraType, onExit }: StudyProps): React.ReactElement {
  const { storage, updateCardState, addLearnedKana, incrementStats } = useStorage();
  const { t } = useLanguage();
  const { goals, cardStates, learnedKanaIds, statistics } = storage;
  const reviewData = useReview({
    goals,
    cardStates,
    learnedKanaIds,
    todayNewLearned: statistics.todayNewLearned,
    todayReviewed: statistics.todayReviewed,
  });
  const [sessionCards, setSessionCards] = useState<Kana[] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  useEffect(() => {
    let cards: Kana[];
    if (extraType === 'extra-new') {
      cards = reviewData.newCards.slice(0, EXTRA_CARDS_COUNT);
    } else if (extraType === 'extra-review') {
      cards = reviewData.dueCards.slice(0, EXTRA_CARDS_COUNT);
    } else if (extraType === 'practice') {
      const allLearned = getLearnedCards(learnedKanaIds, goals);
      const shuffled = [...allLearned];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      cards = shuffled;
    } else {
      cards = getCardsForSession(
        reviewData.dueCards,
        reviewData.newCards,
        reviewData.remainingNewToday,
        reviewData.remainingReviewToday
      );
    }
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setSessionCards(cards);
  }, []);
  const handleComplete = (results: { kanaId: string; quality: number; isCorrect?: boolean }[]): void => {
    const uniqueResults = new Map<string, { kanaId: string; quality: number; isCorrect?: boolean }>();
    for (const result of results) {
      uniqueResults.set(result.kanaId, result);
    }
    let correct = 0;
    for (const result of uniqueResults.values()) {
      const isCorrect = result.isCorrect ?? result.quality >= 3;
      if (isCorrect) correct++;
    }
    if (extraType === 'practice') {
      setSessionStats({ correct, total: uniqueResults.size });
      setIsComplete(true);
      return;
    }
    for (const result of uniqueResults.values()) {
      const isNew = !learnedKanaIds.includes(result.kanaId);
      const isCorrect = result.isCorrect ?? result.quality >= 3;
      const existingState = cardStates[result.kanaId];
      const currentState = existingState ?? createInitialCardState(result.kanaId);
      const newState = calculateNextReview(currentState, result.quality);
      updateCardState(newState);
      if (isNew) {
        addLearnedKana(result.kanaId);
      }
      incrementStats(isNew, isCorrect);
    }
    setSessionStats({ correct, total: uniqueResults.size });
    setIsComplete(true);
  };
  if (sessionCards === null) {
    return <div className={styles.container} />;
  }
  if (sessionCards.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>{t.study.noCards}</p>
          <button className={styles.exitButton} onClick={onExit}>
            {t.study.backToHome}
          </button>
        </div>
      </div>
    );
  }
  if (isComplete) {
    const accuracy = sessionStats.total > 0
      ? Math.round((sessionStats.correct / sessionStats.total) * 100)
      : 0;
    return (
      <div className={styles.container}>
        <div className={styles.complete}>
          <h2 className={styles.completeTitle}>{t.study.sessionComplete}</h2>
          <div className={styles.completeStats}>
            <div className={styles.completeStat}>
              <span className={styles.completeValue}>{sessionStats.total}</span>
              <span className={styles.completeLabel}>{t.study.cardsStudied}</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeValue}>{accuracy}%</span>
              <span className={styles.completeLabel}>{t.study.accuracy}</span>
            </div>
          </div>
          <button className={styles.exitButton} onClick={onExit}>
            {t.study.backToHome}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      {mode === 'flashcard' && (
        <FlashCard
          cards={sessionCards}
          onComplete={handleComplete}
          onExit={onExit}
          t={t}
        />
      )}
      {mode === 'quiz' && (
        <QuizMode
          cards={sessionCards}
          onComplete={handleComplete}
          onExit={onExit}
          t={t}
        />
      )}
      {mode === 'writing' && (
        <WritingMode
          cards={sessionCards}
          onComplete={handleComplete}
          onExit={onExit}
          t={t}
        />
      )}
      {mode === 'pairing' && (
        <PairingMode
          cards={sessionCards}
          onComplete={handleComplete}
          onExit={onExit}
          t={t}
        />
      )}
    </div>
  );
}
