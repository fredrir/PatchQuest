"use client";

import { Button, Group, Paper, Stack } from "@mantine/core";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "@/components/common/Icon";

interface Props {
  title?: string;
  children: ReactNode;
  /** Footer slot — usually the submit/skip buttons. */
  footer?: ReactNode;
  submitLabel?: string;
  onSubmit?: () => void;
  canSubmit?: boolean;
  onSkip?: () => void;
  busy?: boolean;
}

/**
 * Generic shell for answer-input UIs (line picker, fix picker, text box,
 * multiple choice). The runner composes the panel by passing its
 * mode-specific input as `children` plus a submit handler. No mode logic
 * lives here.
 */
export function AnswerPanel({
  title,
  children,
  footer,
  submitLabel = "Check answer",
  onSubmit,
  canSubmit = true,
  onSkip,
  busy,
}: Props) {
  return (
    <Paper
      withBorder
      radius="lg"
      p="lg"
      style={{
        background: "var(--app-surface)",
        borderColor: "var(--app-border)",
      }}
    >
      <Stack gap="md">
        {title ? (
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              fontWeight: 700,
              color: "var(--app-fg-muted)",
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </div>
        ) : null}
        {children}
        {footer ?? (
          <Group justify="space-between" mt="xs">
            {onSkip ? (
              <Button variant="subtle" color="gray" onClick={onSkip} disabled={busy}>
                Skip
              </Button>
            ) : (
              <span />
            )}
            {onSubmit ? (
              <Button
                color="ntnuBlue"
                onClick={onSubmit}
                disabled={!canSubmit || busy}
                rightSection={<ArrowRightIcon size={16} />}
              >
                {submitLabel}
              </Button>
            ) : null}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
