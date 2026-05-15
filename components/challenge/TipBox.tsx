"use client";
import { Alert, Text, Button, Group } from "@mantine/core";
import { useState } from "react";

interface Props {
  hint?: string | null;
}

const TipBox = ({ hint }: Props) => {
  const [tipOpen, setTipOpen] = useState(false);
  if (!hint) return null;

  if (tipOpen) {
    return (
      <Alert
        color="ntnuBlue"
        variant="light"
        radius="md"
        title="Tip"
        withCloseButton
        onClose={() => setTipOpen(false)}
      >
        <Text size="sm" className="whitespace-pre-wrap">
          {hint}
        </Text>
      </Alert>
    );
  }

  return (
    <Group justify="flex-start">
      <Button
        size="xs"
        variant="subtle"
        color="ntnuBlue"
        onClick={() => setTipOpen(true)}
      >
        Show tip
      </Button>
    </Group>
  );
};

export default TipBox;
