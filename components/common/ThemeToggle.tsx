"use client";

import {
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  type MantineColorScheme,
} from "@mantine/core";
import { MonitorIcon, MoonIcon, SunIcon } from "./Icon";

const NEXT: Record<MantineColorScheme, MantineColorScheme> = {
  light: "dark",
  dark: "light",
  auto: "light",
};

const LABEL: Record<MantineColorScheme, string> = {
  light: "Light theme",
  dark: "Dark theme",
  auto: "System theme",
};

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const next = NEXT[colorScheme];

  const Icon =
    colorScheme === "light"
      ? SunIcon
      : colorScheme === "dark"
        ? MoonIcon
        : MonitorIcon;

  return (
    <Tooltip label={`Click for ${LABEL[next]}`}>
      <ActionIcon
        size="lg"
        variant="default"
        aria-label={`Switch to ${LABEL[next]}`}
        onClick={() => setColorScheme(next)}
      >
        <Icon size={18} />
      </ActionIcon>
    </Tooltip>
  );
}
