"use client";

import { Group, Paper, Stack, Text, Chip } from "@mantine/core";
import { COURSE_TOPIC_META, type CourseTopic } from "@/domain/topic";
import { DIFFICULTIES, DIFFICULTY_META, type Difficulty } from "@/domain/difficulty";
import { useSettings } from "@/state/useSettings";

export function FiltersBar() {
  const { settings, setTopicFilter, setDifficultyFilter } = useSettings();

  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      style={{
        background: "var(--app-surface)",
        borderColor: "var(--app-border)",
      }}
    >
      <Stack gap="sm">
        <div>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb={6}>
            Topic
          </Text>
          <Chip.Group
            multiple
            value={[...settings.topicFilter]}
            onChange={(v) => setTopicFilter(v as CourseTopic[])}
          >
            <Group gap={6}>
              {Object.values(COURSE_TOPIC_META).map((meta) => (
                <Chip
                  key={meta.id}
                  value={meta.id}
                  color={meta.color}
                  variant="light"
                  size="sm"
                  radius="sm"
                >
                  {meta.label}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
        </div>

        <div>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb={6}>
            Difficulty
          </Text>
          <Chip.Group
            multiple
            value={[...settings.difficultyFilter]}
            onChange={(v) => setDifficultyFilter(v as Difficulty[])}
          >
            <Group gap={6}>
              {DIFFICULTIES.map((d) => (
                <Chip
                  key={d}
                  value={d}
                  color={DIFFICULTY_META[d].color}
                  variant="light"
                  size="sm"
                  radius="sm"
                >
                  {DIFFICULTY_META[d].label}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
        </div>
      </Stack>
    </Paper>
  );
}
