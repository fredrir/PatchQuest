"use client";

import { usePersistentState } from "./usePersistentState";
import type { ChallengeId, GameModeId } from "@/domain/ids";
import type { FeedbackVerdict } from "@/domain/feedback";

export interface AttemptRecord {
  challengeId: ChallengeId;
  mode: GameModeId;
  verdict: FeedbackVerdict;
  score: number;
  at: number;
}

export interface ProgressState {
  attempts: AttemptRecord[];
}

const DEFAULTS: ProgressState = { attempts: [] };

const MAX_ATTEMPTS = 500;

export function useProgress() {
  const [state, setState, reset] = usePersistentState<ProgressState>(
    "progress",
    DEFAULTS,
  );

  const record = (record: AttemptRecord) =>
    setState((prev) => {
      const next = [...prev.attempts, record];
      if (next.length > MAX_ATTEMPTS) next.splice(0, next.length - MAX_ATTEMPTS);
      return { attempts: next };
    });

  const totals = state.attempts.reduce(
    (acc, a) => {
      acc.total += 1;
      acc.scoreSum += a.score;
      if (a.verdict === "correct") acc.correct += 1;
      else if (a.verdict === "partial") acc.partial += 1;
      else acc.incorrect += 1;
      return acc;
    },
    { total: 0, correct: 0, partial: 0, incorrect: 0, scoreSum: 0 },
  );

  return {
    attempts: state.attempts,
    totals,
    accuracy: totals.total === 0 ? 0 : totals.scoreSum / totals.total,
    record,
    reset,
  };
}
