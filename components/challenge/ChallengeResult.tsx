"use client";

import { Button, Group, Stack } from "@mantine/core";
import { ScoreSummary } from "./ScoreSummary";
import { FeedbackCard } from "./FeedbackCard";
import { ArrowLeftIcon } from "@/components/common/Icon";
import type { Feedback } from "@/domain/feedback";
import type { SessionSummary } from "@/domain/scoring";
import type { Challenge } from "@/domain/challenge";

interface Props {
  summary: SessionSummary;
  /** Optional per-attempt feedback to display below the summary. */
  attempts?: ReadonlyArray<{ challenge: Challenge; feedback: Feedback }>;
  onRestart?: () => void;
  onExit?: () => void;
}

/**
 * Final screen rendered when a run is complete. Used by all mode runners and
 * by the exam-mode "reveal at the end" flow.
 */
export function ChallengeResult({
  summary,
  attempts,
  onRestart,
  onExit,
}: Props) {
  return (
    <Stack gap="lg">
      <ScoreSummary summary={summary} />
      <Group>
        {onRestart ? (
          <Button color="ntnuBlue" onClick={onRestart}>
            Try another run
          </Button>
        ) : null}
        {onExit ? (
          <Button
            variant="default"
            onClick={onExit}
            leftSection={<ArrowLeftIcon size={16} />}
          >
            Back to dashboard
          </Button>
        ) : null}
      </Group>
      {attempts && attempts.length > 0 ? (
        <Stack gap="md">
          {attempts.map(({ challenge, feedback }, i) => (
            <FeedbackCard
              key={`${challenge.id}-${i}`}
              feedback={feedback}
              reference={challenge.title}
            />
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
