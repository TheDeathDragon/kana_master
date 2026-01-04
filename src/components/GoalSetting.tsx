import React, { useState } from 'react';
import { LearningGoals, KanaType, KanaGroup } from '../types';
import { basicGroups, dakutenGroups, yoonGroups } from '../data/kana';
import { Translations } from '../i18n';
import styles from './GoalSetting.module.css';

interface GoalSettingProps {
  goals: LearningGoals;
  onSave: (goals: LearningGoals) => void;
  onCancel: () => void;
  onReset: () => void;
  t: Translations;
}

const newCardOptions = [5, 10, 15, 20, 25, 30];
const reviewLimitOptions = [20, 50, 100, 150, 200];

export function GoalSetting({ goals, onSave, onCancel, onReset, t }: GoalSettingProps): React.ReactElement {
  const [dailyNewCards, setDailyNewCards] = useState(goals.dailyNewCards);
  const [dailyReviewLimit, setDailyReviewLimit] = useState(goals.dailyReviewLimit);
  const [kanaTypes, setKanaTypes] = useState<KanaType[]>([...goals.kanaTypes]);
  const [priorityGroups, setPriorityGroups] = useState<KanaGroup[]>([...goals.priorityGroups]);
  const handleKanaTypeToggle = (type: KanaType): void => {
    setKanaTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };
  const handleGroupToggle = (group: KanaGroup): void => {
    setPriorityGroups((prev) => {
      if (prev.includes(group)) {
        return prev.filter((g) => g !== group);
      }
      return [...prev, group];
    });
  };
  const handleSelectAllBasic = (): void => {
    setPriorityGroups(basicGroups);
  };
  const handleSelectAll = (): void => {
    setPriorityGroups([...basicGroups, ...dakutenGroups, ...yoonGroups]);
  };
  const handleSave = (): void => {
    onSave({
      dailyNewCards,
      dailyReviewLimit,
      kanaTypes,
      priorityGroups: priorityGroups.length > 0 ? priorityGroups : basicGroups,
    });
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t.settings.learningGoals}</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.settings.dailyNewCards}</h3>
        <div className={styles.optionGrid}>
          {newCardOptions.map((n) => (
            <button
              key={n}
              className={`${styles.optionButton} ${dailyNewCards === n ? styles.selected : ''}`}
              onClick={() => setDailyNewCards(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.settings.dailyReviewLimit}</h3>
        <div className={styles.optionGrid}>
          {reviewLimitOptions.map((n) => (
            <button
              key={n}
              className={`${styles.optionButton} ${dailyReviewLimit === n ? styles.selected : ''}`}
              onClick={() => setDailyReviewLimit(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.settings.kanaTypes}</h3>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={kanaTypes.includes('hiragana')}
              onChange={() => handleKanaTypeToggle('hiragana')}
            />
            <span>{t.settings.hiragana}</span>
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={kanaTypes.includes('katakana')}
              onChange={() => handleKanaTypeToggle('katakana')}
            />
            <span>{t.settings.katakana}</span>
          </label>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t.settings.characterGroups}</h3>
        <div className={styles.quickSelect}>
          <button className={styles.quickButton} onClick={handleSelectAllBasic}>
            {t.settings.basicOnly}
          </button>
          <button className={styles.quickButton} onClick={handleSelectAll}>
            {t.settings.selectAll}
          </button>
        </div>
        <div className={styles.groupSection}>
          <h4 className={styles.groupTitle}>{t.settings.basicSeion}</h4>
          <div className={styles.groupGrid}>
            {basicGroups.map((group) => (
              <label key={group} className={styles.groupCheckbox}>
                <input
                  type="checkbox"
                  checked={priorityGroups.includes(group)}
                  onChange={() => handleGroupToggle(group)}
                />
                <span>{t.groups[group]}</span>
              </label>
            ))}
          </div>
        </div>
        <div className={styles.groupSection}>
          <h4 className={styles.groupTitle}>{t.settings.dakutenHandakuten}</h4>
          <div className={styles.groupGrid}>
            {dakutenGroups.map((group) => (
              <label key={group} className={styles.groupCheckbox}>
                <input
                  type="checkbox"
                  checked={priorityGroups.includes(group)}
                  onChange={() => handleGroupToggle(group)}
                />
                <span>{t.groups[group]}</span>
              </label>
            ))}
          </div>
        </div>
        <div className={styles.groupSection}>
          <h4 className={styles.groupTitle}>{t.settings.yoon}</h4>
          <div className={styles.groupGrid}>
            {yoonGroups.map((group) => (
              <label key={group} className={styles.groupCheckbox}>
                <input
                  type="checkbox"
                  checked={priorityGroups.includes(group)}
                  onChange={() => handleGroupToggle(group)}
                />
                <span>{t.groups[group]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.resetButton} onClick={onReset}>
          {t.settings.resetAll}
        </button>
        <div className={styles.actionRight}>
          <button className={styles.cancelButton} onClick={onCancel}>
            {t.settings.cancel}
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            {t.settings.saveGoals}
          </button>
        </div>
      </div>
    </div>
  );
}
