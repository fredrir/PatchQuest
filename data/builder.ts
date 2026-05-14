import type { Challenge, FixOption } from "@/domain/challenge";
import type { ChallengeId, FixOptionId, GameModeId } from "@/domain/ids";
import { challengeId, fixOptionId } from "@/domain/ids";
import { GAME_MODE_IDS } from "@/domain/gameMode";

/** Default mode set for code-based challenges that have fix options. */
export const ALL_CODE_MODES: readonly GameModeId[] = [
  GAME_MODE_IDS.vulnSearch,
  GAME_MODE_IDS.fixSuggestion,
  GAME_MODE_IDS.findAndFix,
  GAME_MODE_IDS.explainExam,
  GAME_MODE_IDS.multipleChoiceSprint,
];

export const VULN_AND_EXPLAIN_MODES: readonly GameModeId[] = [
  GAME_MODE_IDS.vulnSearch,
  GAME_MODE_IDS.explainExam,
];

export const EXPLAIN_AND_MC_MODES: readonly GameModeId[] = [
  GAME_MODE_IDS.explainExam,
  GAME_MODE_IDS.multipleChoiceSprint,
];

export interface BuildChallengeArgs
  extends Omit<Challenge, "id" | "fixOptions" | "correctFixId" | "supportedModes"> {
  id: string;
  fixOptions?: ReadonlyArray<Omit<FixOption, "id"> & { id: string }>;
  correctFixId?: string;
  supportedModes?: readonly GameModeId[];
}

export function buildChallenge(args: BuildChallengeArgs): Challenge {
  const fixOptions: readonly FixOption[] = (args.fixOptions ?? []).map((o) => ({
    ...o,
    id: fixOptionId(`${args.id}/${o.id}`),
  }));
  const correctFixId =
    args.correctFixId !== undefined
      ? fixOptionId(`${args.id}/${args.correctFixId}`)
      : undefined;
  const supportedModes = args.supportedModes ?? defaultModesFor(args, fixOptions);
  return {
    ...args,
    id: challengeId(args.id),
    fixOptions,
    correctFixId,
    supportedModes,
  };
}

function defaultModesFor(
  args: BuildChallengeArgs,
  fixOptions: readonly FixOption[],
): readonly GameModeId[] {
  const modes: GameModeId[] = [];
  if (args.code && args.vulnerableLines.length > 0) {
    modes.push(GAME_MODE_IDS.vulnSearch);
    if (fixOptions.length > 0 && args.correctFixId) {
      modes.push(GAME_MODE_IDS.findAndFix);
      modes.push(GAME_MODE_IDS.fixSuggestion);
    }
  }
  if (args.examKeywords.length > 0) {
    modes.push(GAME_MODE_IDS.explainExam);
  }
  if (args.modeData?.multipleChoice) {
    modes.push(GAME_MODE_IDS.multipleChoiceSprint);
  }
  if (args.modeData?.attackTrace) {
    modes.push(GAME_MODE_IDS.attackTrace);
  }
  if (args.modeData?.wstgMapping) {
    modes.push(GAME_MODE_IDS.wstgMapping);
  }
  if (args.modeData?.secureRequirement) {
    modes.push(GAME_MODE_IDS.secureRequirement);
  }
  if (args.modeData?.stride) {
    modes.push(GAME_MODE_IDS.strideThreat);
  }
  if (args.modeData?.riskScoring) {
    modes.push(GAME_MODE_IDS.riskScoring);
  }
  if (args.modeData?.privacyScenario) {
    modes.push(GAME_MODE_IDS.privacyGdpr);
  }
  if (args.modeData?.cryptoMisuse) {
    modes.push(GAME_MODE_IDS.cryptoMisuse);
  }
  if (args.modeData?.aiReview) {
    modes.push(GAME_MODE_IDS.aiReview);
  }
  if (args.modeData?.reportBuilder) {
    modes.push(GAME_MODE_IDS.reportBuilder);
  }
  return modes;
}

/**
 * Convenience for fix options. The id collisions are isolated per challenge
 * because `buildChallenge` namespaces them.
 */
export function fix(
  id: string,
  label: string,
  rationale: string,
  opts: { code?: string; tempting?: boolean } = {},
): Omit<FixOption, "id"> & { id: string } {
  return { id, label, rationale, code: opts.code, tempting: opts.tempting };
}

export type FixOptionDraft = ReturnType<typeof fix>;
export type { ChallengeId, FixOptionId };
