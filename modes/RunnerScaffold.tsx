"use client";

import { useRouter } from "next/navigation";
import { Button, Group, Stack, Title } from "@mantine/core";
import { ChallengeLayout } from "@/components/challenge/ChallengeLayout";
import { ChallengeResult } from "@/components/challenge/ChallengeResult";
import { FeedbackCard } from "@/components/challenge/FeedbackCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ArrowRightIcon, ShieldIcon } from "@/components/common/Icon";
import { summarize } from "@/domain/scoring";
import type { Challenge } from "@/domain/challenge";
import type { Feedback } from "@/domain/feedback";
import type { ReactNode } from "react";

interface Props {
  modeTitle: string;
  examMode: boolean;
  total: number;
  index: number;
  current: Challenge | undefined;
  feedback: Feedback | null;
  stage: "in-progress" | "feedback" | "complete";
  attempts: ReadonlyArray<{ challenge: Challenge; feedback: Feedback }>;
  prompt?: string;
  workspace: ReactNode;
  answer: ReactNode;
  onNext: () => void;
  onRestart: () => void;
}

/**
 * Wraps the per-mode UI with feedback / completion handling so each runner
 * doesn't have to duplicate it. The runner only renders its mode-specific
 * `workspace` + `answer`; everything else (navigation, summary, empty state)
 * is handled here.
 */
export function RunnerScaffold({
  modeTitle,
  examMode,
  total,
  index,
  current,
  feedback,
  stage,
  attempts,
  prompt,
  workspace,
  answer,
  onNext,
  onRestart,
}: Props) {
  const router = useRouter();

  if (total === 0 || !current) {
    return (
      <EmptyState
        icon={<ShieldIcon size={36} />}
        title="No challenges match"
        description="Try clearing the topic or difficulty filters from the dashboard."
        action={
          <Button variant="light" onClick={() => router.push("/")}>
            Back to dashboard
          </Button>
        }
      />
    );
  }

  if (stage === "complete") {
    const summary = summarize(attempts.map((a) => a.feedback));
    return (
      <Stack gap="lg" maw={1100} mx="auto" w="100%">
        <Title order={2}>Run complete</Title>
        <ChallengeResult
          summary={summary}
          attempts={attempts}
          onRestart={onRestart}
          onExit={() => router.push("/")}
        />
      </Stack>
    );
  }

  return (
    <ChallengeLayout
      challenge={current}
      prompt={prompt}
      modeTitle={modeTitle}
      current={index + 1}
      total={total}
      examMode={examMode}
      workspace={workspace}
      answer={
        <Stack gap="md">
          {answer}
          {stage === "feedback" && feedback ? (
            <>
              <FeedbackCard feedback={feedback} />
              <Group justify="flex-end">
                <Button
                  color="ntnuBlue"
                  rightSection={<ArrowRightIcon size={16} />}
                  onClick={onNext}
                >
                  {index + 1 >= total ? "See results" : "Next challenge"}
                </Button>
              </Group>
            </>
          ) : null}
        </Stack>
      }
    />
  );
}
