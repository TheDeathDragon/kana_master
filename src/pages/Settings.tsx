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
  const [showResetModal, setShowResetModal] = useState(false);
  const handleSave = (goals: LearningGoals): void => {
    updateGoals(goals);
    onBack();
  };
  const handleReset = (): void => {
    resetData();
    setShowResetModal(false);
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
          onReset={() => setShowResetModal(true)}
          t={t}
        />
      </main>
      {showResetModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>{t.settings.resetAll}</h3>
            <p className={styles.modalText}>{t.settings.resetWarning}</p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setShowResetModal(false)}
              >
                {t.settings.cancel}
              </button>
              <button className={styles.modalConfirm} onClick={handleReset}>
                {t.settings.confirmReset}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
