import { CardState } from '../types';

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

export function createInitialCardState(kanaId: string): CardState {
  const today = new Date().toISOString().split('T')[0];
  return {
    kanaId,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReviewDate: today,
    lastReviewDate: today,
  };
}

export function calculateNextReview(
  cardState: CardState,
  quality: number
): CardState {
  const today = new Date().toISOString().split('T')[0];
  let { easeFactor, interval, repetitions } = cardState;
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < MIN_EASE_FACTOR) {
    easeFactor = MIN_EASE_FACTOR;
  }
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  const nextReviewDate = nextDate.toISOString().split('T')[0];
  return {
    kanaId: cardState.kanaId,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastReviewDate: today,
  };
}

export function isDueForReview(cardState: CardState): boolean {
  const today = new Date().toISOString().split('T')[0];
  return cardState.nextReviewDate <= today;
}

export function qualityFromCorrectness(isCorrect: boolean, confidence: number): number {
  if (!isCorrect) {
    return confidence < 0.5 ? 0 : 2;
  }
  if (confidence >= 0.9) {
    return 5;
  }
  if (confidence >= 0.7) {
    return 4;
  }
  return 3;
}

export function getQualityLabel(quality: number): string {
  switch (quality) {
    case 0:
      return 'Complete blackout';
    case 1:
      return 'Incorrect, but remembered upon seeing';
    case 2:
      return 'Incorrect, but easy to recall';
    case 3:
      return 'Correct with difficulty';
    case 4:
      return 'Correct with hesitation';
    case 5:
      return 'Perfect response';
    default:
      return 'Unknown';
  }
}

export function sortByDueDate(cardStates: CardState[]): CardState[] {
  return [...cardStates].sort((a, b) => {
    return a.nextReviewDate.localeCompare(b.nextReviewDate);
  });
}

export function getOverdueCards(cardStates: CardState[]): CardState[] {
  const today = new Date().toISOString().split('T')[0];
  return cardStates.filter((card) => card.nextReviewDate < today);
}

export function getDueCards(cardStates: CardState[]): CardState[] {
  return cardStates.filter((card) => isDueForReview(card));
}
