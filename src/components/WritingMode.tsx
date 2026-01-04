import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Kana } from '../types';
import { findPairedKana } from '../data/kana';
import { Translations } from '../i18n';
import styles from './WritingMode.module.css';

interface WritingModeProps {
  cards: Kana[];
  onComplete: (results: { kanaId: string; quality: number; isCorrect: boolean }[]) => void;
  onExit: () => void;
  t: Translations;
}

export function WritingMode({ cards, onComplete, onExit, t }: WritingModeProps): React.ReactElement {
  const [queue, setQueue] = useState<Kana[]>(() => [...cards]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [results, setResults] = useState<{ kanaId: string; quality: number; isCorrect: boolean }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentCard = queue[0];
  const totalCards = cards.length;
  const progress = totalCards > 0 ? (masteredCount / totalCards) * 100 : 0;
  useEffect(() => {
    inputRef.current?.focus();
    setWrongAttempts(0);
  }, [currentCard]);
  const checkAnswer = useCallback((): boolean => {
    return userInput.trim().toLowerCase() === currentCard?.romaji.toLowerCase();
  }, [userInput, currentCard]);
  const handleSubmit = useCallback(() => {
    if (isAnswered || isShaking || !userInput.trim()) return;
    const correct = checkAnswer();
    if (!correct) {
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);
      if (newAttempts >= 3) {
        setIsAnswered(true);
        return;
      }
      setIsShaking(true);
      setTimeout(() => {
        setUserInput('');
        setIsShaking(false);
        inputRef.current?.focus();
      }, 500);
      return;
    }
    setIsAnswered(true);
  }, [isAnswered, isShaking, userInput, checkAnswer, wrongAttempts]);
  const isCorrect = userInput.trim().toLowerCase() === currentCard?.romaji.toLowerCase();
  const handleNext = useCallback(() => {
    const quality = isCorrect ? 4 : 1;
    const newResults = [...results, { kanaId: currentCard.id, quality, isCorrect }];
    setResults(newResults);
    if (isCorrect) {
      setMasteredCount((prev) => prev + 1);
      const newQueue = queue.slice(1);
      if (newQueue.length === 0) {
        onComplete(newResults);
      } else {
        setQueue(newQueue);
        setUserInput('');
        setIsAnswered(false);
      }
    } else {
      const newQueue = [...queue.slice(1), currentCard];
      setQueue(newQueue);
      setUserInput('');
      setIsAnswered(false);
    }
  }, [isCorrect, currentCard, queue, results, onComplete]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onExit();
      }
      if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleNext, onExit]);
  const handleInputKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !isAnswered) {
      e.preventDefault();
      handleSubmit();
    }
  };
  if (!currentCard) {
    return <div className={styles.container}>{t.writing.noCards}</div>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.exitButton} onClick={onExit}>
          {t.writing.exit}
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
      <div className={styles.questionArea}>
        <div className={styles.kanaDisplay}>
          <span className={styles.mainKana}>{currentCard.type === 'hiragana' ? currentCard.character : findPairedKana(currentCard)?.character}</span>
          <span className={styles.pairedKana}>{currentCard.type === 'katakana' ? currentCard.character : findPairedKana(currentCard)?.character}</span>
        </div>
        <p className={styles.question}>
          {t.writing.typeRomaji}
        </p>
      </div>
      <div className={styles.inputArea}>
        <input
          ref={inputRef}
          type="text"
          className={`${styles.input} ${isShaking ? styles.inputShake : ''} ${isAnswered ? styles.inputCorrect : ''}`}
          value={userInput}
          onChange={(e) => {
            const filtered = e.target.value.replace(/[^a-zA-Z]/g, '');
            setUserInput(filtered);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder={t.writing.placeholder}
          disabled={isAnswered || isShaking}
          autoComplete="off"
        />
        {!isAnswered && (
          <div className={styles.buttonGroup}>
            <button
              className={styles.forgotButton}
              onClick={() => setIsAnswered(true)}
            >
              {t.writing.forgot}
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!userInput.trim()}
            >
              {t.writing.check}
            </button>
          </div>
        )}
      </div>
      {isAnswered && (
        <div className={styles.feedback}>
          {isCorrect ? (
            <p className={styles.correctText}>{t.writing.correct}</p>
          ) : (
            <div className={styles.incorrectFeedback}>
              <p className={styles.incorrectText}>{t.writing.incorrect}</p>
              <p className={styles.correctAnswer}>
                {t.writing.correctAnswer} <span className={styles.romajiAnswer}>{currentCard.romaji}</span>
              </p>
            </div>
          )}
          <button className={styles.nextButton} onClick={handleNext}>
            {(queue.length === 1 && isCorrect) ? t.writing.finish : t.writing.next}
          </button>
        </div>
      )}
    </div>
  );
}
