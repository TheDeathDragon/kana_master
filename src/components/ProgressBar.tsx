import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  color?: 'primary' | 'success' | 'warning';
}

export function ProgressBar({
  value,
  max,
  label,
  showPercent = true,
  color = 'primary',
}: ProgressBarProps): React.ReactElement {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.barContainer}>
        <div className={styles.bar}>
          <div
            className={`${styles.fill} ${styles[color]}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        {showPercent && (
          <span className={styles.percent}>{percent}%</span>
        )}
      </div>
      <span className={styles.count}>
        {value} / {max}
      </span>
    </div>
  );
}
