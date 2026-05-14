import { Stack, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Stack
      align="center"
      gap="sm"
      py="xl"
      style={{
        border: "1px dashed var(--app-border-strong)",
        borderRadius: 16,
        background: "var(--app-surface-muted)",
      }}
    >
      {icon ? <div style={{ color: "var(--app-fg-subtle)" }}>{icon}</div> : null}
      <Title order={4} ta="center">
        {title}
      </Title>
      {description ? (
        <Text c="dimmed" size="sm" ta="center" maw={420}>
          {description}
        </Text>
      ) : null}
      {action}
    </Stack>
  );
}
