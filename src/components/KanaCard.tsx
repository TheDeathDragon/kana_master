import React, { useState, useMemo } from 'react';
import { Kana } from '../types';
import { findPairedKana } from '../data/kana';
import styles from './KanaCard.module.css';

interface KanaCardProps {
  kana: Kana;
  showRomaji?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function KanaCard({ kana, showRomaji = false, onClick, size = 'medium' }: KanaCardProps): React.ReactElement {
  return (
    <div
      className={`${styles.card} ${styles[size]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <span className={styles.character}>{kana.character}</span>
      {showRomaji && <span className={styles.romaji}>{kana.romaji}</span>}
    </div>
  );
}

interface FlippableKanaCardProps {
  kana: Kana;
  size?: 'small' | 'medium' | 'large';
  showPaired?: boolean;
  onFlip?: (isFlipped: boolean) => void;
}

export function FlippableKanaCard({ kana, size = 'large', showPaired = false, onFlip }: FlippableKanaCardProps): React.ReactElement {
  const [showRomaji, setShowRomaji] = useState(false);
  const pairedKana = useMemo(() => showPaired ? findPairedKana(kana) : undefined, [kana, showPaired]);
  const handleClick = (): void => {
    const newState = !showRomaji;
    setShowRomaji(newState);
    onFlip?.(newState);
  };
  const hiraganaChar = kana.type === 'hiragana' ? kana.character : pairedKana?.character;
  const katakanaChar = kana.type === 'katakana' ? kana.character : pairedKana?.character;
  return (
    <div className={`${styles.card} ${styles[size]} ${styles.clickable} ${showPaired ? styles.paired : ''}`} onClick={handleClick}>
      {showPaired && hiraganaChar && katakanaChar ? (
        <>
          <span className={styles.character}>{hiraganaChar}</span>
          <span className={styles.pairedCharacter}>{katakanaChar}</span>
        </>
      ) : (
        <span className={styles.character}>{kana.character}</span>
      )}
      {showRomaji && <span className={styles.romaji}>{kana.romaji}</span>}
    </div>
  );
}
