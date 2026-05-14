import type { Answer } from "./answer";
import type { Challenge } from "./challenge";
import type { Feedback } from "./feedback";
import { verdictFromScore } from "./scoring";
import { GAME_MODE_IDS } from "./gameMode";

/** Set-similarity for line-selection answers (Jaccard). */
function jaccard<T>(
  a: ReadonlySet<T> | readonly T[],
  b: ReadonlySet<T> | readonly T[],
): number {
  const setA = a instanceof Set ? a : new Set(a);
  const setB = b instanceof Set ? b : new Set(b);
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const v of setA) if (setB.has(v)) intersection += 1;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 1 : intersection / union;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

/**
 * Keyword-presence scorer used by Explain Like the Exam. Each keyword can be
 * a single token or a multi-word phrase; matching is case-insensitive and
 * tolerates surrounding punctuation. Returns the share of keywords found.
 */
export function gradeKeywords(
  text: string,
  keywords: readonly string[],
): { score: number; matched: string[]; missed: string[] } {
  if (keywords.length === 0) {
    return { score: 1, matched: [], missed: [] };
  }
  const haystack = ` ${normalize(text)} `;
  const matched: string[] = [];
  const missed: string[] = [];
  for (const kw of keywords) {
    const needle = normalize(kw).trim();
    if (!needle) continue;
    if (haystack.includes(` ${needle} `) || haystack.includes(needle)) {
      matched.push(kw);
    } else {
      missed.push(kw);
    }
  }
  return {
    score: matched.length / keywords.length,
    matched,
    missed,
  };
}

/**
 * Single entry point. Pure: given the challenge and the user's answer, return
 * a `Feedback` value. Each mode handler is local and easy to extend.
 */
export function gradeAnswer(challenge: Challenge, answer: Answer): Feedback {
  switch (answer.kind) {
    case "line-selection":
      return gradeLineSelection(challenge, answer.selectedLines);
    case "fix-selection":
      return gradeFixSelection(challenge, answer.selectedFixId);
    case "find-and-fix":
      return gradeFindAndFix(
        challenge,
        answer.selectedLines,
        answer.selectedFixId,
      );
    case "text":
      return gradeText(challenge, answer);
    case "multiple-choice":
      return gradeMultipleChoice(challenge, answer);
    case "multi-select":
      return gradeMultiSelect(challenge, answer);
    case "ai-review":
      return gradeAiReview(challenge, answer);
    case "report-builder":
      return gradeReportBuilder(challenge, answer);
  }
}

function gradeLineSelection(
  challenge: Challenge,
  selected: readonly number[],
): Feedback {
  const expected = challenge.vulnerableLines;
  const score = jaccard(selected, expected);
  const verdict = verdictFromScore(score);

  const expectedSet = new Set(expected);
  const selectedSet = new Set(selected);
  const missed = expected.filter((l) => !selectedSet.has(l));
  const wrong = [...selectedSet].filter((l) => !expectedSet.has(l));

  return {
    verdict,
    score,
    headline:
      verdict === "correct"
        ? "Spot on"
        : verdict === "partial"
          ? "Almost there"
          : "Missed the flaw",
    detail: challenge.explanation,
    highlights: [
      {
        label: "Vulnerable lines",
        tone: "neutral",
        value: expected.join(", "),
      },
      missed.length
        ? { label: "Missed", tone: "negative", value: missed.join(", ") }
        : { label: "Missed", tone: "positive", value: "none" },
      wrong.length
        ? { label: "Extra", tone: "negative", value: wrong.join(", ") }
        : { label: "Extra", tone: "positive", value: "none" },
    ],
  };
}

function gradeFixSelection(
  challenge: Challenge,
  selectedFixId: string | null,
): Feedback {
  const correct =
    selectedFixId !== null && selectedFixId === challenge.correctFixId;
  const picked = challenge.fixOptions.find((o) => o.id === selectedFixId);
  return {
    verdict: correct ? "correct" : "incorrect",
    score: correct ? 1 : 0,
    headline: correct ? "Correct fix" : "Tempting, but no",
    detail: picked
      ? `${picked.rationale}\n\n${challenge.explanation}`
      : challenge.explanation,
  };
}

function gradeFindAndFix(
  challenge: Challenge,
  selectedLines: readonly number[],
  selectedFixId: string | null,
): Feedback {
  const lineScore = jaccard(selectedLines, challenge.vulnerableLines);
  const fixCorrect =
    selectedFixId !== null && selectedFixId === challenge.correctFixId;
  // 50% lines, 50% fix; both must be right for a perfect score.
  const score = lineScore * 0.5 + (fixCorrect ? 0.5 : 0);
  const verdict = verdictFromScore(score);
  return {
    verdict,
    score,
    headline:
      verdict === "correct"
        ? "Located and patched"
        : verdict === "partial"
          ? "Partial credit"
          : "Needs another look",
    detail: challenge.explanation,
    highlights: [
      {
        label: "Lines",
        tone: lineScore >= 0.85 ? "positive" : lineScore > 0 ? "neutral" : "negative",
        value: `${Math.round(lineScore * 100)}%`,
      },
      {
        label: "Fix",
        tone: fixCorrect ? "positive" : "negative",
        value: fixCorrect ? "correct" : "wrong",
      },
    ],
  };
}

function keywordsForTextMode(
  challenge: Challenge,
  mode: string,
): readonly string[] {
  if (mode === GAME_MODE_IDS.secureRequirement && challenge.modeData?.secureRequirement) {
    return challenge.modeData.secureRequirement.keywords;
  }
  return challenge.examKeywords;
}

function gradeText(
  challenge: Challenge,
  answer: { text: string; mode: string },
): Feedback {
  const keywords = keywordsForTextMode(challenge, answer.mode);
  const { score, matched, missed } = gradeKeywords(answer.text, keywords);
  const verdict = verdictFromScore(score);
  return {
    verdict,
    score,
    headline:
      verdict === "correct"
        ? "Strong answer"
        : verdict === "partial"
          ? "Some key points"
          : "Missing the core ideas",
    detail: challenge.explanation,
    highlights: [
      matched.length
        ? { label: "Mentioned", tone: "positive", value: matched.join(", ") }
        : { label: "Mentioned", tone: "neutral", value: "none" },
      missed.length
        ? { label: "Missing", tone: "negative", value: missed.join(", ") }
        : { label: "Missing", tone: "positive", value: "none" },
    ],
  };
}

interface PickableOption {
  readonly id: string;
  readonly correct: boolean;
  readonly rationale: string;
}

function optionsForChoiceMode(
  challenge: Challenge,
  mode: string,
): readonly PickableOption[] | null {
  if (mode === GAME_MODE_IDS.attackTrace && challenge.modeData?.attackTrace) {
    return challenge.modeData.attackTrace.options;
  }
  if (mode === GAME_MODE_IDS.wstgMapping && challenge.modeData?.wstgMapping) {
    return challenge.modeData.wstgMapping.options;
  }
  if (mode === GAME_MODE_IDS.riskScoring && challenge.modeData?.riskScoring) {
    return challenge.modeData.riskScoring.options;
  }
  if (challenge.modeData?.multipleChoice) {
    return challenge.modeData.multipleChoice.options.map((o) => ({
      id: o.id,
      correct: o.correct,
      rationale: o.rationale ?? "",
    }));
  }
  return null;
}

function gradeMultipleChoice(
  challenge: Challenge,
  answer: { selectedOptionId: string | null; mode: string },
): Feedback {
  const options = optionsForChoiceMode(challenge, answer.mode);
  if (!options) {
    return {
      verdict: "incorrect",
      score: 0,
      headline: "No question",
      detail: "This challenge does not include a question for this mode.",
    };
  }
  const picked = options.find((o) => o.id === answer.selectedOptionId);
  const correct = picked?.correct === true;
  return {
    verdict: correct ? "correct" : "incorrect",
    score: correct ? 1 : 0,
    headline: correct ? "Correct" : "Incorrect",
    detail: picked?.rationale
      ? `${picked.rationale}\n\n${challenge.explanation}`
      : challenge.explanation,
  };
}

function optionsForMultiSelect(
  challenge: Challenge,
  mode: string,
): readonly PickableOption[] | null {
  if (mode === GAME_MODE_IDS.strideThreat && challenge.modeData?.stride) {
    return challenge.modeData.stride.options;
  }
  if (mode === GAME_MODE_IDS.privacyGdpr && challenge.modeData?.privacyScenario) {
    return challenge.modeData.privacyScenario.principles;
  }
  if (mode === GAME_MODE_IDS.cryptoMisuse && challenge.modeData?.cryptoMisuse) {
    return challenge.modeData.cryptoMisuse.options;
  }
  return null;
}

function gradeMultiSelect(
  challenge: Challenge,
  answer: { selectedOptionIds: readonly string[]; mode: string },
): Feedback {
  const options = optionsForMultiSelect(challenge, answer.mode);
  if (!options) {
    return {
      verdict: "incorrect",
      score: 0,
      headline: "No question",
      detail: "This challenge does not include a multi-select question for this mode.",
    };
  }
  const correctIds = new Set(options.filter((o) => o.correct).map((o) => o.id));
  const selected = new Set(answer.selectedOptionIds);
  let truePositive = 0;
  let falsePositive = 0;
  for (const id of selected) {
    if (correctIds.has(id)) truePositive += 1;
    else falsePositive += 1;
  }
  const falseNegative = correctIds.size - truePositive;
  const denom = truePositive + falsePositive + falseNegative;
  const score = denom === 0 ? 1 : truePositive / denom;
  const verdict = verdictFromScore(score);

  const correctLabels = options
    .filter((o) => o.correct)
    .map((o) => (o as PickableOption & { label?: string }).label ?? o.id);
  const missed = options
    .filter((o) => o.correct && !selected.has(o.id))
    .map((o) => (o as PickableOption & { label?: string }).label ?? o.id);
  const extra = options
    .filter((o) => !o.correct && selected.has(o.id))
    .map((o) => (o as PickableOption & { label?: string }).label ?? o.id);

  return {
    verdict,
    score,
    headline:
      verdict === "correct"
        ? "All threats found"
        : verdict === "partial"
          ? "Some on target"
          : "Re-read the scenario",
    detail: challenge.explanation,
    highlights: [
      {
        label: "Expected",
        tone: "neutral",
        value: correctLabels.join(", ") || "none",
      },
      missed.length
        ? { label: "Missed", tone: "negative", value: missed.join(", ") }
        : { label: "Missed", tone: "positive", value: "none" },
      extra.length
        ? { label: "Extra", tone: "negative", value: extra.join(", ") }
        : { label: "Extra", tone: "positive", value: "none" },
    ],
  };
}

function gradeAiReview(
  challenge: Challenge,
  answer: { verdict: "safe" | "unsafe" | null; reason: string },
): Feedback {
  const scenario = challenge.modeData?.aiReview;
  if (!scenario) {
    return {
      verdict: "incorrect",
      score: 0,
      headline: "No AI review",
      detail: "This challenge does not include an AI review scenario.",
    };
  }
  const expected = scenario.safe ? "safe" : "unsafe";
  const verdictCorrect = answer.verdict === expected;
  const { score: keywordScore, matched, missed } = gradeKeywords(
    answer.reason,
    scenario.reasonKeywords,
  );
  const score = verdictCorrect
    ? 0.6 + 0.4 * keywordScore
    : 0.2 * keywordScore;
  const verdict = verdictFromScore(score);
  return {
    verdict,
    score,
    headline: verdictCorrect
      ? keywordScore >= 0.7
        ? "Well-justified verdict"
        : "Right call, thin reasoning"
      : "Wrong verdict",
    detail: challenge.explanation,
    highlights: [
      {
        label: "Expected verdict",
        tone: verdictCorrect ? "positive" : "negative",
        value: expected,
      },
      matched.length
        ? { label: "Mentioned", tone: "positive", value: matched.join(", ") }
        : { label: "Mentioned", tone: "neutral", value: "none" },
      missed.length
        ? { label: "Missing", tone: "negative", value: missed.join(", ") }
        : { label: "Missing", tone: "positive", value: "none" },
    ],
  };
}

function gradeReportBuilder(
  challenge: Challenge,
  answer: { fields: Readonly<Record<string, string>> },
): Feedback {
  const template = challenge.modeData?.reportBuilder;
  if (!template) {
    return {
      verdict: "incorrect",
      score: 0,
      headline: "No template",
      detail: "This challenge does not include a report-builder template.",
    };
  }
  let total = 0;
  let achieved = 0;
  const highlights: Array<{
    label: string;
    tone: "positive" | "negative" | "neutral";
    value?: string;
  }> = [];
  for (const field of template.fields) {
    if (field.keywords.length === 0) continue;
    const value = answer.fields[field.id] ?? "";
    const { score, missed } = gradeKeywords(value, field.keywords);
    total += 1;
    achieved += score;
    highlights.push({
      label: field.label,
      tone: score >= 0.7 ? "positive" : score > 0 ? "neutral" : "negative",
      value:
        missed.length === 0
          ? "complete"
          : `missing: ${missed.slice(0, 3).join(", ")}`,
    });
  }
  const overall = total === 0 ? 1 : achieved / total;
  const verdict = verdictFromScore(overall);
  return {
    verdict,
    score: overall,
    headline:
      verdict === "correct"
        ? "Reportable writeup"
        : verdict === "partial"
          ? "Add the missing pieces"
          : "Needs much more depth",
    detail: challenge.explanation,
    highlights,
  };
}
