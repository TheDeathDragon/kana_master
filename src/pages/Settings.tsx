import React, { useState } from 'react';
import { LearningGoals } from '../types';
import { GoalSetting } from '../components/GoalSetting';
import { useStorage } from '../hooks/useStorage';
import { useLanguage } from '../hooks/useLanguage';
import styles from './Settings.module.css';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps): React.ReactElement {
  const { storage, updateGoals, resetData } = useStorage();
  const { t } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const handleSave = (goals: LearningGoals): void => {
    updateGoals(goals);
    onBack();
  };
  const handleReset = (): void => {
    resetData();
    setShowResetConfirm(false);
    onBack();
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.settings.title}</h1>
        <button className={styles.backButton} onClick={onBack}>
          {t.settings.back}
        </button>
      </header>
      <main className={styles.main}>
        <GoalSetting
          goals={storage.goals}
          onSave={handleSave}
          onCancel={onBack}
          t={t}
        />
        <div className={styles.dangerZone}>
          <h3 className={styles.dangerTitle}>{t.settings.dangerZone}</h3>
          <p className={styles.dangerText}>
            {t.settings.resetWarning}
          </p>
          {!showResetConfirm ? (
            <button
              className={styles.resetButton}
              onClick={() => setShowResetConfirm(true)}
            >
              {t.settings.resetAll}
            </button>
          ) : (
            <div className={styles.confirmButtons}>
              <button className={styles.confirmReset} onClick={handleReset}>
                {t.settings.confirmReset}
              </button>
              <button
                className={styles.cancelReset}
                onClick={() => setShowResetConfirm(false)}
              >
                {t.settings.cancel}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
