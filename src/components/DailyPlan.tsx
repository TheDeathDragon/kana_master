import React, { useState } from 'react';
import { StudyMode, ExtraStudyType } from '../types';
import { Translations } from '../i18n';
import styles from './DailyPlan.module.css';

interface DailyPlanProps {
  dueCount: number;
  newCount: number;
  remainingReview: number;
  remainingNew: number;
  totalNewAvailable: number;
  totalLearnedAvailable: number;
  onStartStudy: (mode: StudyMode, extraType?: ExtraStudyType) => void;
  t: Translations;
}

export function DailyPlan({
  dueCount,
  newCount,
  remainingReview,
  remainingNew,
  totalNewAvailable,
  totalLearnedAvailable,
  onStartStudy,
  t,
}: DailyPlanProps): React.ReactElement {
  const [extraMode, setExtraMode] = useState<'extra-new' | 'practice' | null>(null);
  const totalToStudy = Math.min(dueCount, remainingReview) + Math.min(newCount, remainingNew);
  const estimatedMinutes = Math.ceil(totalToStudy * 0.5);
  const hasExtraNew = totalNewAvailable > 0;
  const hasPractice = totalLearnedAvailable > 0;
  const handleExtraStudy = (mode: StudyMode): void => {
    if (extraMode) {
      onStartStudy(mode, extraMode);
      setExtraMode(null);
    }
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.dailyPlan.title}</h2>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{Math.min(dueCount, remainingReview)}</span>
          <span className={styles.statLabel}>{t.dailyPlan.reviewsDue}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{Math.min(newCount, remainingNew)}</span>
          <span className={styles.statLabel}>{t.dailyPlan.newCards}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{estimatedMinutes}</span>
          <span className={styles.statLabel}>{t.dailyPlan.estMinutes}</span>
        </div>
      </div>
      {totalToStudy > 0 ? (
        <div className={styles.modeSelection}>
          <p className={styles.modeLabel}>{t.dailyPlan.chooseMode}</p>
          <div className={styles.modeButtons}>
            <button
              className={styles.modeButton}
              onClick={() => onStartStudy('flashcard', 'normal')}
            >
              <span className={styles.modeIcon}>🎴</span>
              <span className={styles.modeName}>{t.modes.flashcard}</span>
              <span className={styles.modeDesc}>{t.modes.flashcardDesc}</span>
            </button>
            <button
              className={styles.modeButton}
              onClick={() => onStartStudy('quiz', 'normal')}
            >
              <span className={styles.modeIcon}>✅</span>
              <span className={styles.modeName}>{t.modes.quiz}</span>
              <span className={styles.modeDesc}>{t.modes.quizDesc}</span>
            </button>
            <button
              className={styles.modeButton}
              onClick={() => onStartStudy('writing', 'normal')}
            >
              <span className={styles.modeIcon}>✍️</span>
              <span className={styles.modeName}>{t.modes.writing}</span>
              <span className={styles.modeDesc}>{t.modes.writingDesc}</span>
            </button>
            <button
              className={styles.modeButton}
              onClick={() => onStartStudy('pairing', 'normal')}
            >
              <span className={styles.modeIcon}>🔗</span>
              <span className={styles.modeName}>{t.modes.pairing}</span>
              <span className={styles.modeDesc}>{t.modes.pairingDesc}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.completed}>
          <span className={styles.completedIcon}>🎉</span>
          <p className={styles.completedText}>{t.dailyPlan.completed}</p>
          <p className={styles.completedSub}>{t.dailyPlan.comeBack}</p>
          {(hasExtraNew || hasPractice) && !extraMode && (
            <div className={styles.extraStudy}>
              {hasExtraNew && (
                <button
                  className={styles.extraButton}
                  onClick={() => setExtraMode('extra-new')}
                >
                  {t.dailyPlan.learnMore}
                </button>
              )}
              {hasPractice && (
                <button
                  className={styles.extraButton}
                  onClick={() => setExtraMode('practice')}
                >
                  {t.dailyPlan.practice}
                </button>
              )}
            </div>
          )}
          {extraMode && (
            <div className={styles.modeSelection}>
              <p className={styles.modeLabel}>{t.dailyPlan.chooseMode}</p>
              <div className={styles.modeButtons}>
                <button
                  className={styles.modeButton}
                  onClick={() => handleExtraStudy('flashcard')}
                >
                  <span className={styles.modeIcon}>🎴</span>
                  <span className={styles.modeName}>{t.modes.flashcard}</span>
                  <span className={styles.modeDesc}>{t.modes.flashcardDesc}</span>
                </button>
                <button
                  className={styles.modeButton}
                  onClick={() => handleExtraStudy('quiz')}
                >
                  <span className={styles.modeIcon}>✅</span>
                  <span className={styles.modeName}>{t.modes.quiz}</span>
                  <span className={styles.modeDesc}>{t.modes.quizDesc}</span>
                </button>
                <button
                  className={styles.modeButton}
                  onClick={() => handleExtraStudy('writing')}
                >
                  <span className={styles.modeIcon}>✍️</span>
                  <span className={styles.modeName}>{t.modes.writing}</span>
                  <span className={styles.modeDesc}>{t.modes.writingDesc}</span>
                </button>
                <button
                  className={styles.modeButton}
                  onClick={() => handleExtraStudy('pairing')}
                >
                  <span className={styles.modeIcon}>🔗</span>
                  <span className={styles.modeName}>{t.modes.pairing}</span>
                  <span className={styles.modeDesc}>{t.modes.pairingDesc}</span>
                </button>
              </div>
              <button
                className={styles.cancelButton}
                onClick={() => setExtraMode(null)}
              >
                {t.settings.cancel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
