"use client";

import Link from "next/link";
import { Button, Stack, Text, Title } from "@mantine/core";

export default function NotFound() {
  return (
    <Stack align="center" gap="md" py="xl" mt="xl">
      <Title order={1}>Page not found</Title>
      <Text c="dimmed" size="md">
        That route doesn&apos;t exist. Head back to the dashboard.
      </Text>
      <Button component={Link} href="/" variant="light">
        Back to dashboard
      </Button>
    </Stack>
  );
}
