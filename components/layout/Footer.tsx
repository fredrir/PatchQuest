import { Group, Text } from "@mantine/core";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <Group
      h="100%"
      px="lg"
      justify="space-between"
      wrap="nowrap"
      style={{ borderTop: "1px solid var(--app-border)" }}
    >
      <Text size="xs" c="dimmed">
        © {year} Fredrik Carsten Hansteen. Built for TDT4237 exam practice.
      </Text>
      <Text size="xs" c="dimmed" visibleFrom="sm">
        Practice mode shows feedback instantly · Exam mode reveals only at the end
      </Text>
    </Group>
  );
}
