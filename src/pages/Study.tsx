import React, { useState, useEffect, useRef } from 'react';
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
const COMBO_PHASES: StudyMode[] = ['flashcard', 'quiz', 'writing'];

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
  const [sessionStats, setSessionStats] = useState({ mastered: 0, needsReview: 0, total: 0 });
  const exitButtonRef = useRef<HTMLButtonElement>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseResults, setPhaseResults] = useState<Map<string, { quality: number; isCorrect: boolean }>>(new Map());
  const [isPhaseVisible, setIsPhaseVisible] = useState(true);
  const isComboMode = mode === 'combo';
  const currentMode = isComboMode ? COMBO_PHASES[currentPhase] : mode;
  const isLastPhase = currentPhase === COMBO_PHASES.length - 1;
  useEffect(() => {
    if (isComplete && exitButtonRef.current) {
      exitButtonRef.current.focus();
    }
  }, [isComplete]);
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
  const saveProgress = (results: Map<string, { quality: number; isCorrect: boolean }>): void => {
    let mastered = 0;
    let needsReview = 0;
    for (const result of results.values()) {
      if (result.quality >= 4) {
        mastered++;
      } else {
        needsReview++;
      }
    }
    if (extraType !== 'practice') {
      for (const [kanaId, result] of results) {
        const isNew = !learnedKanaIds.includes(kanaId);
        const existingState = cardStates[kanaId];
        const currentState = existingState ?? createInitialCardState(kanaId);
        const newState = calculateNextReview(currentState, result.quality);
        updateCardState(newState);
        if (isNew) {
          addLearnedKana(kanaId);
        }
        incrementStats(isNew, result.isCorrect);
      }
    }
    setSessionStats({ mastered, needsReview, total: results.size });
  };
  const handleComplete = (results: { kanaId: string; quality: number; isCorrect?: boolean }[]): void => {
    const uniqueResults = new Map<string, { quality: number; isCorrect: boolean }>();
    for (const result of results) {
      uniqueResults.set(result.kanaId, {
        quality: result.quality,
        isCorrect: result.isCorrect ?? result.quality >= 3,
      });
    }
    if (isComboMode) {
      const newPhaseResults = new Map(phaseResults);
      for (const [kanaId, result] of uniqueResults) {
        newPhaseResults.set(kanaId, result);
      }
      setPhaseResults(newPhaseResults);
      if (isLastPhase) {
        saveProgress(newPhaseResults);
        setIsComplete(true);
      } else {
        setIsPhaseVisible(false);
        setTimeout(() => {
          setCurrentPhase(prev => prev + 1);
          setIsPhaseVisible(true);
        }, 300);
      }
      return;
    }
    saveProgress(uniqueResults);
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
    return (
      <div className={styles.container}>
        <div className={styles.complete}>
          <h2 className={styles.completeTitle}>{t.study.sessionComplete}</h2>
          <div className={styles.completeStats}>
            <div className={styles.completeStat}>
              <span className={styles.completeValue}>{sessionStats.total}</span>
              <span className={styles.completeLabel}>{t.study.cardsStudied}</span>
            </div>
            <div className={`${styles.completeStat} ${styles.mastered}`}>
              <span className={styles.completeValue}>{sessionStats.mastered}</span>
              <span className={styles.completeLabel}>{t.study.mastered}</span>
            </div>
            {sessionStats.needsReview > 0 && (
              <div className={`${styles.completeStat} ${styles.needsReview}`}>
                <span className={styles.completeValue}>{sessionStats.needsReview}</span>
                <span className={styles.completeLabel}>{t.study.needsReview}</span>
              </div>
            )}
          </div>
          <button ref={exitButtonRef} className={styles.exitButton} onClick={onExit}>
            {t.study.backToHome}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      {isComboMode && (
        <div className={styles.phaseIndicator}>
          {COMBO_PHASES.map((phase, idx) => (
            <div
              key={phase}
              className={`${styles.phaseStep} ${idx < currentPhase ? styles.completed : ''} ${idx === currentPhase ? styles.active : ''}`}
            >
              <span className={styles.phaseNumber}>{idx + 1}</span>
            </div>
          ))}
          <span className={styles.phaseLabel}>
            {t.study.phase} {currentPhase + 1}{t.study.phaseOf}{COMBO_PHASES.length}
          </span>
        </div>
      )}
      <div className={`${styles.phaseContent} ${isPhaseVisible ? styles.phaseVisible : ''}`}>
        {currentMode === 'flashcard' && (
          <FlashCard
            cards={sessionCards}
            onComplete={handleComplete}
            onExit={onExit}
            t={t}
          />
        )}
        {currentMode === 'quiz' && (
          <QuizMode
            cards={sessionCards}
            onComplete={handleComplete}
            onExit={onExit}
            t={t}
          />
        )}
        {currentMode === 'writing' && (
          <WritingMode
            cards={sessionCards}
            onComplete={handleComplete}
            onExit={onExit}
            t={t}
          />
        )}
        {currentMode === 'pairing' && (
          <PairingMode
            cards={sessionCards}
            onComplete={handleComplete}
            onExit={onExit}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
