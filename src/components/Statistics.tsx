import React from 'react';
import { Statistics as StatsType } from '../types';
import { ProgressBar } from './ProgressBar';
import { Translations } from '../i18n';
import styles from './Statistics.module.css';

interface StatisticsProps {
  statistics: StatsType;
  totalLearned: number;
  totalKana: number;
  t: Translations;
}

export function Statistics({ statistics, totalLearned, totalKana, t }: StatisticsProps): React.ReactElement {
  const accuracy = statistics.totalReviews > 0
    ? Math.round((statistics.correctReviews / statistics.totalReviews) * 100)
    : 0;
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.statistics.title}</h2>
      <div className={styles.progressSection}>
        <ProgressBar
          value={totalLearned}
          max={totalKana}
          label={t.statistics.charactersLearned}
          color="success"
        />
      </div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔥</span>
          <span className={styles.statValue}>{statistics.streakDays}</span>
          <span className={styles.statLabel}>{t.statistics.dayStreak}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📚</span>
          <span className={styles.statValue}>{statistics.totalReviews}</span>
          <span className={styles.statLabel}>{t.statistics.totalReviews}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🎯</span>
          <span className={styles.statValue}>{accuracy}%</span>
          <span className={styles.statLabel}>{t.statistics.accuracy}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>✨</span>
          <span className={styles.statValue}>{totalLearned}</span>
          <span className={styles.statLabel}>{t.statistics.mastered}</span>
        </div>
      </div>
      <div className={styles.todaySection}>
        <h3 className={styles.todayTitle}>{t.statistics.today}</h3>
        <div className={styles.todayStats}>
          <div className={styles.todayStat}>
            <span className={styles.todayValue}>{statistics.todayNewLearned}</span>
            <span className={styles.todayLabel}>{t.statistics.newLearned}</span>
          </div>
          <div className={styles.todayStat}>
            <span className={styles.todayValue}>{statistics.todayReviewed}</span>
            <span className={styles.todayLabel}>{t.statistics.reviewed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
