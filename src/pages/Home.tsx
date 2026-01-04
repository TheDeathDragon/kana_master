import React from 'react';
import { StudyMode, ExtraStudyType } from '../types';
import { DailyPlan } from '../components/DailyPlan';
import { useStorage } from '../hooks/useStorage';
import { useReview } from '../hooks/useReview';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import styles from './Home.module.css';

interface HomeProps {
  onStartStudy: (mode: StudyMode, extraType?: ExtraStudyType) => void;
  onNavigate: (page: 'settings') => void;
}

export function Home({ onStartStudy, onNavigate }: HomeProps): React.ReactElement {
  const { storage } = useStorage();
  const { goals, statistics, cardStates, learnedKanaIds } = storage;
  const { theme, toggleTheme } = useTheme();
  const { language, t, toggleLanguage } = useLanguage();
  const reviewData = useReview({
    goals,
    cardStates,
    learnedKanaIds,
    todayNewLearned: statistics.todayNewLearned,
    todayReviewed: statistics.todayReviewed,
  });
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.home.title}</h1>
        <div className={styles.headerButtons}>
          <a
            className={styles.toggleButton}
            href="https://github.com/TheDeathDragon/kana_master"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            GitHub
          </a>
          <button
            className={styles.toggleButton}
            onClick={toggleTheme}
            title={theme === 'light' ? t.settings.dark : t.settings.light}
          >
            {theme === 'light' ? t.buttons.dark : t.buttons.light}
          </button>
          <button
            className={styles.toggleButton}
            onClick={toggleLanguage}
            title={t.settings.language}
          >
            {language === 'zh' ? 'EN' : t.buttons.switchToZh}
          </button>
          <button
            className={styles.toggleButton}
            onClick={() => onNavigate('settings')}
            title={t.home.settings}
          >
            {t.buttons.settings}
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.card}>
          <DailyPlan
            dueCount={reviewData.dueCards.length}
            newCount={reviewData.newCards.length}
            remainingReview={reviewData.remainingReviewToday}
            remainingNew={reviewData.remainingNewToday}
            totalNewAvailable={reviewData.newCards.length}
            totalLearnedAvailable={reviewData.totalLearned}
            totalLearned={reviewData.totalLearned}
            totalKana={reviewData.totalKana}
            streakDays={statistics.streakDays}
            totalReviews={statistics.totalReviews}
            onStartStudy={onStartStudy}
            t={t}
          />
        </div>
      </main>
    </div>
  );
}
