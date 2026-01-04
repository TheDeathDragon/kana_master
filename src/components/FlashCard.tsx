import React, { useState, useEffect, useCallback } from 'react';
import { Kana } from '../types';
import { findPairedKana } from '../data/kana';
import { Translations } from '../i18n';
import styles from './FlashCard.module.css';

interface FlashCardProps {
  cards: Kana[];
  onComplete: (results: { kanaId: string; quality: number }[]) => void;
  onExit: () => void;
  t: Translations;
}

export function FlashCard({ cards, onComplete, onExit, t }: FlashCardProps): React.ReactElement {
  const qualityOptions = [
    { value: 0, label: t.flashcard.again, color: '#ef4444' },
    { value: 3, label: t.flashcard.hard, color: '#f59e0b' },
    { value: 4, label: t.flashcard.good, color: '#22c55e' },
    { value: 5, label: t.flashcard.easy, color: '#3b82f6' },
  ];
  const [queue, setQueue] = useState<Kana[]>(() => [...cards]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<{ kanaId: string; quality: number }[]>([]);
  const currentCard = queue[0];
  const totalCards = cards.length;
  const progress = totalCards > 0 ? (masteredCount / totalCards) * 100 : 0;
  const handleQuality = useCallback((quality: number) => {
    const newResults = [...results, { kanaId: currentCard.id, quality }];
    setResults(newResults);
    const isMastered = quality >= 4;
    if (isMastered) {
      setMasteredCount((prev) => prev + 1);
      const newQueue = queue.slice(1);
      if (newQueue.length === 0) {
        onComplete(newResults);
      } else {
        setQueue(newQueue);
        setIsFlipped(false);
      }
    } else {
      const newQueue = [...queue.slice(1), currentCard];
      setQueue(newQueue);
      setIsFlipped(false);
    }
  }, [currentCard, queue, results, onComplete]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!isFlipped) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setIsFlipped(true);
        }
      } else {
        if (e.key === '1') handleQuality(0);
        else if (e.key === '2') handleQuality(3);
        else if (e.key === '3') handleQuality(4);
        else if (e.key === '4') handleQuality(5);
      }
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, handleQuality, onExit]);
  if (!currentCard) {
    return <div className={styles.container}>{t.flashcard.noCards}</div>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.exitButton} onClick={onExit}>
          {t.flashcard.exit}
        </button>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressText}>
            {masteredCount} / {totalCards}
          </span>
        </div>
      </div>
      <div
        className={styles.questionArea}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className={styles.kanaDisplay}>
          <span className={styles.mainKana}>
            {currentCard.type === 'hiragana' ? currentCard.character : findPairedKana(currentCard)?.character}
          </span>
          <span className={styles.pairedKana}>
            {currentCard.type === 'katakana' ? currentCard.character : findPairedKana(currentCard)?.character}
          </span>
        </div>
        {isFlipped ? (
          <p className={styles.romaji}>{currentCard.romaji}</p>
        ) : (
          <p className={styles.hint}>{t.flashcard.clickToReveal}</p>
        )}
      </div>
      {isFlipped && (
        <div className={styles.qualityButtons}>
          <p className={styles.qualityLabel}>{t.flashcard.howWell}</p>
          <div className={styles.buttons}>
            {qualityOptions.map((option, idx) => (
              <button
                key={option.value}
                className={styles.qualityButton}
                style={{ backgroundColor: option.color }}
                onClick={() => handleQuality(option.value)}
              >
                <span className={styles.keyHint}>{idx + 1}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
