"use client";

import { Group, Text, Textarea } from "@mantine/core";

interface Props {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Suggested length range for exam-style answers. */
  hintRange?: [number, number];
}

export function TextAnswerBox({
  value,
  onChange,
  placeholder,
  disabled,
  hintRange = [3, 6],
}: Props) {
  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const sentenceCount =
    value.trim() === "" ? 0 : value.trim().split(/[.!?]+/).filter(Boolean).length;

  return (
    <div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={
          placeholder ?? "Write a 3–6 sentence exam-style answer."
        }
        disabled={disabled}
        autosize
        minRows={6}
        maxRows={14}
        styles={{
          input: {
            background: "var(--app-surface-muted)",
            borderColor: "var(--app-border-strong)",
            fontSize: 15,
            lineHeight: 1.55,
          },
        }}
      />
      <Group justify="space-between" mt={6}>
        <Text size="xs" c="dimmed">
          Aim for {hintRange[0]}–{hintRange[1]} sentences. Use technical terms
          where possible.
        </Text>
        <Text size="xs" c="dimmed">
          {sentenceCount} sentences · {wordCount} words
        </Text>
      </Group>
    </div>
  );
}
