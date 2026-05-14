"use client";

import { useCallback, useState } from "react";
import type { Answer } from "@/domain/answer";
import type { Challenge } from "@/domain/challenge";
import type { Feedback } from "@/domain/feedback";
import type { GameModeId } from "@/domain/ids";
import { gradeAnswer } from "@/domain/grading";
import { useProgress } from "@/state/useProgress";
import { useStreak } from "@/state/useStreak";
import { useMistakes } from "@/state/useMistakes";

export type RunnerStage = "in-progress" | "feedback" | "complete";

export interface RunnerState {
  current: Challenge;
  index: number;
  total: number;
  stage: RunnerStage;
  feedback: Feedback | null;
  attempts: ReadonlyArray<{ challenge: Challenge; feedback: Feedback }>;
  /** True only in exam mode while the run is incomplete. */
  hideFeedback: boolean;
}

export interface RunnerControls {
  submit: (answer: Answer) => void;
  next: () => void;
  skip: () => void;
  restart: () => void;
}

export interface UseChallengeRunnerArgs {
  challenges: readonly Challenge[];
  mode: GameModeId;
  examMode: boolean;
}

/**
 * Shared state machine for every per-challenge runner. The runner component
 * owns its mode-specific input UI; this hook handles index, grading, feedback
 * staging, and progress/streak/mistake side-effects.
 */
export function useChallengeRunner({
  challenges,
  mode,
  examMode,
}: UseChallengeRunnerArgs): { state: RunnerState; controls: RunnerControls } | null {
  const { record } = useProgress();
  const { bump } = useStreak();
  const { add: addMistake } = useMistakes();

  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<RunnerStage>("in-progress");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [attempts, setAttempts] = useState<
    ReadonlyArray<{ challenge: Challenge; feedback: Feedback }>
  >([]);

  const total = challenges.length;
  const current = challenges[index];

  const submit = useCallback(
    (answer: Answer) => {
      if (!current) return;
      const f = gradeAnswer(current, answer);
      record({
        challengeId: current.id,
        mode,
        verdict: f.verdict,
        score: f.score,
        at: Date.now(),
      });
      bump();
      if (f.verdict !== "correct") {
        addMistake({ challengeId: current.id, mode, at: Date.now() });
      }
      const nextAttempts = [...attempts, { challenge: current, feedback: f }];
      setAttempts(nextAttempts);
      setFeedback(f);
      // In exam mode we suppress the inline feedback card and roll straight
      // to the next challenge. Practice mode pauses on the feedback step.
      if (examMode) {
        if (index + 1 >= total) {
          setStage("complete");
        } else {
          setIndex(index + 1);
        }
      } else {
        setStage("feedback");
      }
    },
    [
      current,
      record,
      mode,
      bump,
      addMistake,
      attempts,
      examMode,
      index,
      total,
    ],
  );

  const next = useCallback(() => {
    if (index + 1 >= total) {
      setStage("complete");
    } else {
      setIndex(index + 1);
      setStage("in-progress");
      setFeedback(null);
    }
  }, [index, total]);

  const skip = useCallback(() => {
    if (index + 1 >= total) {
      setStage("complete");
    } else {
      setIndex(index + 1);
      setStage("in-progress");
      setFeedback(null);
    }
  }, [index, total]);

  const restart = useCallback(() => {
    setIndex(0);
    setStage("in-progress");
    setFeedback(null);
    setAttempts([]);
  }, []);

  if (!current && stage !== "complete") return null;

  return {
    state: {
      current,
      index,
      total,
      stage,
      feedback,
      attempts,
      hideFeedback: examMode && stage !== "complete",
    },
    controls: { submit, next, skip, restart },
    // include summary on the side via state.attempts → summary lives in caller
    // (caller maps attempts → summary as needed).
  } as { state: RunnerState; controls: RunnerControls };
}
