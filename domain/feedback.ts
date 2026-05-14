import type { Answer } from "./answer";
import type { Challenge } from "./challenge";

export type FeedbackVerdict = "correct" | "partial" | "incorrect";

export interface Feedback {
  readonly verdict: FeedbackVerdict;
  /** 0..1, used for streaks and aggregate scoring. */
  readonly score: number;
  readonly headline: string;
  readonly detail: string;
  /** Optional structured highlights surfaced in the result UI. */
  readonly highlights?: readonly FeedbackHighlight[];
}

export interface FeedbackHighlight {
  readonly label: string;
  readonly tone: "positive" | "negative" | "neutral";
  readonly value?: string;
}

export interface GradingContext {
  readonly challenge: Challenge;
  readonly answer: Answer;
}
