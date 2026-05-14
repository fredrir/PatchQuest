import type { Feedback, FeedbackVerdict } from "./feedback";

/**
 * Roll-up of one session's run. Mistakes are stored separately so the review
 * page can show them without traversing every attempt.
 */
export interface SessionSummary {
  readonly total: number;
  readonly correct: number;
  readonly partial: number;
  readonly incorrect: number;
  /** Sum of feedback.score across attempts, divided by total. */
  readonly accuracy: number;
}

export function summarize(verdicts: readonly Feedback[]): SessionSummary {
  const total = verdicts.length;
  if (total === 0) {
    return { total: 0, correct: 0, partial: 0, incorrect: 0, accuracy: 0 };
  }

  let correct = 0;
  let partial = 0;
  let incorrect = 0;
  let scoreSum = 0;
  for (const f of verdicts) {
    scoreSum += f.score;
    if (f.verdict === "correct") correct += 1;
    else if (f.verdict === "partial") partial += 1;
    else incorrect += 1;
  }
  return {
    total,
    correct,
    partial,
    incorrect,
    accuracy: scoreSum / total,
  };
}

export function verdictFromScore(score: number): FeedbackVerdict {
  if (score >= 0.85) return "correct";
  if (score >= 0.5) return "partial";
  return "incorrect";
}
