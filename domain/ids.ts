/**
 * Branded id types so a ChallengeId can never be passed where a FixOptionId
 * is expected, even though both are strings at runtime.
 */
declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

export type ChallengeId = Brand<string, "ChallengeId">;
export type FixOptionId = Brand<string, "FixOptionId">;
export type GameModeId = Brand<string, "GameModeId">;
export type AttemptId = Brand<string, "AttemptId">;

export const challengeId = (raw: string): ChallengeId => raw as ChallengeId;
export const fixOptionId = (raw: string): FixOptionId => raw as FixOptionId;
export const gameModeId = (raw: string): GameModeId => raw as GameModeId;
export const attemptId = (raw: string): AttemptId => raw as AttemptId;
