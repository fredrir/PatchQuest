import { Group, Progress, Stack, Text } from "@mantine/core";

interface Props {
  current: number; // 1-based
  total: number;
  modeTitle: string;
  examMode?: boolean;
}

export function ProgressHeader({ current, total, modeTitle, examMode }: Props) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((current / total) * 100));
  return (
    <Stack gap={6}>
      <Group justify="space-between" wrap="nowrap">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed">
          {modeTitle}
          {examMode ? " · Exam mode" : ""}
        </Text>
        <Text size="xs" c="dimmed" fw={600}>
          {current} of {total}
        </Text>
      </Group>
      <Progress value={pct} color="ntnuBlue" size="sm" radius="xl" />
    </Stack>
  );
}
