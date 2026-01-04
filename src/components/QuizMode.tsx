import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Kana } from '../types';
import { allKana, findPairedKana } from '../data/kana';
import { Translations } from '../i18n';
import styles from './QuizMode.module.css';

interface QuizModeProps {
  cards: Kana[];
  onComplete: (results: { kanaId: string; quality: number; isCorrect: boolean }[]) => void;
  onExit: () => void;
  t: Translations;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateOptions(correctKana: Kana, count: number = 4): Kana[] {
  const sameTypeKana = allKana.filter(
    (k) => k.type === correctKana.type && k.id !== correctKana.id
  );
  const shuffled = shuffleArray(sameTypeKana);
  const wrongOptions = shuffled.slice(0, count - 1);
  const allOptions = [correctKana, ...wrongOptions];
  return shuffleArray(allOptions);
}

export function QuizMode({ cards, onComplete, onExit, t }: QuizModeProps): React.ReactElement {
  const [queue, setQueue] = useState<Kana[]>(() => [...cards]);
  const [masteredCount, setMasteredCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<{ kanaId: string; quality: number; isCorrect: boolean }[]>([]);
  const currentCard = queue[0];
  const totalCards = cards.length;
  const progress = totalCards > 0 ? (masteredCount / totalCards) * 100 : 0;
  const options = useMemo(() => {
    if (!currentCard) return [];
    return generateOptions(currentCard);
  }, [currentCard]);
  const handleSelect = useCallback((kana: Kana) => {
    if (isAnswered) return;
    setSelectedAnswer(kana.id);
    setIsAnswered(true);
  }, [isAnswered]);
  const handleNext = useCallback(() => {
    const isCorrect = selectedAnswer === currentCard.id;
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
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    } else {
      const newQueue = [...queue.slice(1), currentCard];
      setQueue(newQueue);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [selectedAnswer, currentCard, queue, results, onComplete]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!isAnswered) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= options.length) {
          handleSelect(options[num - 1]);
        }
      } else {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
      }
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, options, handleSelect, handleNext, onExit]);
  if (!currentCard) {
    return <div className={styles.container}>{t.quiz.noCards}</div>;
  }
  const isCorrect = selectedAnswer === currentCard.id;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.exitButton} onClick={onExit}>
          {t.quiz.exit}
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
      <div className={styles.mainContent}>
        <div className={styles.questionArea}>
          <div className={styles.kanaDisplay}>
            <span className={styles.mainKana}>{currentCard.type === 'hiragana' ? currentCard.character : findPairedKana(currentCard)?.character}</span>
            <span className={styles.pairedKana}>{currentCard.type === 'katakana' ? currentCard.character : findPairedKana(currentCard)?.character}</span>
          </div>
          <p className={styles.question}>{t.quiz.whatIsRomaji}</p>
        </div>
        <div className={styles.answerArea}>
          <div className={styles.optionsGrid}>
            {options.map((option, idx) => {
              let optionClass = styles.option;
              if (isAnswered) {
                if (option.id === currentCard.id) {
                  optionClass += ` ${styles.correct}`;
                } else if (option.id === selectedAnswer) {
                  optionClass += ` ${styles.incorrect}`;
                }
              } else if (option.id === selectedAnswer) {
                optionClass += ` ${styles.selected}`;
              }
              return (
                <button
                  key={option.id}
                  className={optionClass}
                  onClick={() => handleSelect(option)}
                  disabled={isAnswered}
                >
                  <span className={styles.optionNumber}>{idx + 1}</span>
                  <span className={styles.optionText}>{option.romaji}</span>
                </button>
              );
            })}
          </div>
          {isAnswered && (
            <div className={styles.feedback}>
              <p className={isCorrect ? styles.correctText : styles.incorrectText}>
                {isCorrect ? t.quiz.correct : `${t.quiz.incorrect} "${currentCard.romaji}"`}
              </p>
              <button className={styles.nextButton} onClick={handleNext}>
                {(queue.length === 1 && isCorrect) ? t.quiz.finish : t.quiz.next}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
