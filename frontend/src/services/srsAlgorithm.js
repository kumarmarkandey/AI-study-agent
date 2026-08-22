/**
  * SuperMemo-2 (SM-2) Spaced Repetition Algorithm Implementation
  * 
  * Rating scale:
  * 1 = Again (Failed, complete lapse)
  * 2 = Hard (Correct with difficulty)
  * 3 = Good (Correct with normal recall)
  * 4 = Easy (Perfect instant recall)
  */

export function calculateSRS(card, rating) {
  let { interval = 1, repetition = 0, easeFactor = 2.5 } = card;

  // Enforce limits on ease factor
  if (easeFactor < 1.3) easeFactor = 1.3;

  if (rating === 1) {
    // Again - Reset interval
    repetition = 0;
    interval = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else if (rating === 2) {
    // Hard
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 2;
    } else {
      interval = Math.max(1, Math.round(interval * 1.2));
    }
    repetition += 1;
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (rating === 3) {
    // Good
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 4;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  } else if (rating === 4) {
    // Easy
    if (repetition === 0) {
      interval = 2;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor * 1.3);
    }
    repetition += 1;
    easeFactor = easeFactor + 0.15;
  }

  // Calculate next due date string YYYY-MM-DD
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  const dueDateStr = nextDate.toISOString().split('T')[0];

  const mastered = interval >= 21;

  return {
    ...card,
    interval,
    repetition,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    dueDate: dueDateStr,
    mastered,
    lastReviewed: new Date().toISOString()
  };
}
