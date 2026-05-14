"use client";

import { usePersistentState } from "./usePersistentState";

interface StreakState {
  current: number;
  best: number;
  lastDay: string | null;
}

const DEFAULTS: StreakState = { current: 0, best: 0, lastDay: null };

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  return Math.round(
    (Date.parse(b) - Date.parse(a)) / (1000 * 60 * 60 * 24),
  );
}

/**
 * Day-granularity streak. Calling `bump()` once on a given day advances the
 * streak; subsequent calls the same day are a no-op. A gap of >1 day resets it.
 */
export function useStreak() {
  const [state, setState, reset] = usePersistentState<StreakState>(
    "streak",
    DEFAULTS,
  );

  const bump = () =>
    setState((prev) => {
      const today = dayKey();
      if (prev.lastDay === today) return prev;
      const inc = prev.lastDay && diffDays(prev.lastDay, today) === 1 ? 1 : 0;
      const current = inc ? prev.current + 1 : 1;
      return {
        current,
        best: Math.max(prev.best, current),
        lastDay: today,
      };
    });

  return {
    current: state.current,
    best: state.best,
    lastDay: state.lastDay,
    bump,
    reset,
  };
}
