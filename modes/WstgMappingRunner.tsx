"use client";

import { useState } from "react";
import { Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { AnswerPanel } from "@/components/challenge/AnswerPanel";
import { CodeViewer } from "@/components/challenge/CodeViewer";
import { ScenarioChoiceCard } from "@/components/answers/ScenarioChoiceCard";
import { useChallengeRunner } from "./useChallengeRunner";
import { RunnerScaffold } from "./RunnerScaffold";
import { GAME_MODE_IDS } from "@/domain/gameMode";
import { useShuffled } from "@/lib/useShuffled";
import type { Challenge } from "@/domain/challenge";
import TipBox from "@/components/challenge/TipBox";
import { OWASP_TOP_10, OwaspTop10Id } from "@/domain/owasp";

interface Props {
  challenges: readonly Challenge[];
  examMode: boolean;
}

export function WstgMappingRunner({ challenges, examMode }: Props) {
  const runner = useChallengeRunner({
    challenges,
    mode: GAME_MODE_IDS.wstgMapping,
    examMode,
  });

  const [selected, setSelected] = useState<string | null>(null);

  const currentId = runner?.state.current?.id;
  const [prevId, setPrevId] = useState(currentId);
  if (prevId !== currentId) {
    setPrevId(currentId);
    setSelected(null);
  }

  const challenge = runner?.state.current;
  const mapping = challenge?.modeData?.wstgMapping;
  const mappingOptions = useShuffled(mapping?.options ?? []);

  if (!runner) {
    return (
      <RunnerScaffold
        modeTitle="WSTG Mapping"
        examMode={examMode}
        total={0}
        index={0}
        current={undefined}
        feedback={null}
        stage="in-progress"
        attempts={[]}
        workspace={null}
        answer={null}
        onNext={() => {}}
        onRestart={() => {}}
      />
    );
  }

  const { state, controls } = runner;

  const handleSubmit = () => {
    if (!challenge) return;
    controls.submit({
      kind: "multiple-choice",
      challengeId: challenge.id,
      mode: GAME_MODE_IDS.wstgMapping,
      submittedAt: Date.now(),
      selectedOptionId: selected,
    });
  };

  const owaspTop10Title =
    OWASP_TOP_10[mapping?.top10Hint as OwaspTop10Id] ?? null;

  return (
    <RunnerScaffold
      modeTitle="WSTG Mapping"
      examMode={examMode}
      total={state.total}
      index={state.index}
      current={challenge}
      feedback={state.feedback}
      stage={state.stage}
      attempts={state.attempts}
      prompt={
        mapping?.question ??
        "Map this finding to the correct OWASP WSTG category."
      }
      workspace={
        <Stack gap="md">
          {challenge?.code ? (
            <CodeViewer
              code={challenge.code}
              language={challenge.language ?? "plaintext"}
              filename={challenge.filename}
            />
          ) : (
            <Paper
              withBorder
              radius="lg"
              p="lg"
              className="bg-app-surface border-app-border"
            >
              {" "}
              <Stack gap="md">
                <div className="text-xs uppercase font-bold text-app-fg-muted tracking-wider">
                  Question
                </div>
                <Text size="sm">{challenge?.summary}</Text>
              </Stack>
            </Paper>
          )}
          <TipBox
            hint={`Aligns with OWASP Top 10 category: ${mapping?.top10Hint} - ${owaspTop10Title}`}
          />
        </Stack>
      }
      answer={
        <AnswerPanel
          title="Pick the WSTG code"
          onSubmit={state.stage === "in-progress" ? handleSubmit : undefined}
          canSubmit={selected !== null}
          onSkip={state.stage === "in-progress" ? controls.skip : undefined}
        >
          {mapping ? (
            <SimpleGrid cols={1} spacing="xs">
              {mappingOptions.map((option) => (
                <ScenarioChoiceCard
                  key={option.id}
                  option={{
                    id: option.id,
                    label: `${option.code} · ${option.label}`,
                    correct: option.correct,
                    rationale: option.rationale,
                  }}
                  selected={selected === option.id}
                  onSelect={() => setSelected(option.id)}
                  disabled={state.stage === "feedback"}
                  reveal={state.stage === "feedback"}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text size="sm" c="dimmed">
              No mapping configured.
            </Text>
          )}
        </AnswerPanel>
      }
      onNext={controls.next}
      onRestart={controls.restart}
    />
  );
}
