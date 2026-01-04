import React, { useState } from 'react';
import { StudyMode, ExtraStudyType } from '../types';
import { ProgressBar } from './ProgressBar';
import { Translations } from '../i18n';
import styles from './DailyPlan.module.css';

interface DailyPlanProps {
  dueCount: number;
  newCount: number;
  remainingReview: number;
  remainingNew: number;
  totalNewAvailable: number;
  totalLearnedAvailable: number;
  totalLearned: number;
  totalKana: number;
  streakDays: number;
  totalReviews: number;
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
  totalLearned,
  totalKana,
  streakDays,
  totalReviews,
  onStartStudy,
  t,
}: DailyPlanProps): React.ReactElement {
  const [extraMode, setExtraMode] = useState<'extra-new' | 'practice' | null>(null);
  const totalToStudy = Math.min(dueCount, remainingReview) + Math.min(newCount, remainingNew);
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
      <div className={styles.progressSection}>
        <ProgressBar
          value={totalLearned}
          max={totalKana}
          label={t.statistics.charactersLearned}
          color="success"
        />
      </div>
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{Math.min(dueCount, remainingReview)}</span>
          <span className={styles.statLabel}>{t.dailyPlan.reviewsDue}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{Math.min(newCount, remainingNew)}</span>
          <span className={styles.statLabel}>{t.dailyPlan.newCards}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{streakDays}</span>
          <span className={styles.statLabel}>{t.statistics.dayStreak}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{totalReviews}</span>
          <span className={styles.statLabel}>{t.statistics.totalReviews}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{totalLearned}</span>
          <span className={styles.statLabel}>{t.statistics.mastered}</span>
        </div>
      </div>
      {totalToStudy > 0 || extraMode ? (
        <div className={styles.modeSelection}>
          <p className={styles.modeLabel}>{t.dailyPlan.chooseMode}</p>
          <div className={styles.modeButtons}>
            <button
              className={styles.modeButton}
              onClick={() => extraMode ? handleExtraStudy('flashcard') : onStartStudy('flashcard', 'normal')}
            >
              <span className={styles.modeName}>{t.modes.flashcard}</span>
              <span className={styles.modeDesc}>{t.modes.flashcardDesc}</span>
            </button>
            <button
              className={styles.modeButton}
              onClick={() => extraMode ? handleExtraStudy('quiz') : onStartStudy('quiz', 'normal')}
            >
              <span className={styles.modeName}>{t.modes.quiz}</span>
              <span className={styles.modeDesc}>{t.modes.quizDesc}</span>
            </button>
            <button
              className={styles.modeButton}
              onClick={() => extraMode ? handleExtraStudy('writing') : onStartStudy('writing', 'normal')}
            >
              <span className={styles.modeName}>{t.modes.writing}</span>
              <span className={styles.modeDesc}>{t.modes.writingDesc}</span>
            </button>
            <button
              className={styles.modeButton}
              onClick={() => extraMode ? handleExtraStudy('pairing') : onStartStudy('pairing', 'normal')}
            >
              <span className={styles.modeName}>{t.modes.pairing}</span>
              <span className={styles.modeDesc}>{t.modes.pairingDesc}</span>
            </button>
          </div>
          {extraMode && (
            <button
              className={styles.cancelButton}
              onClick={() => setExtraMode(null)}
            >
              {t.settings.cancel}
            </button>
          )}
        </div>
      ) : (
        <div className={styles.completed}>
          <p className={styles.completedText}>{t.dailyPlan.completed}</p>
          <p className={styles.completedSub}>{t.dailyPlan.comeBack}</p>
          {(hasExtraNew || hasPractice) && (
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
        </div>
      )}
    </div>
  );
}
