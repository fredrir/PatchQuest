"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, NavLink, ScrollArea, Stack, Text } from "@mantine/core";
import { GAME_MODES } from "@/domain/gameMode";
import { GameModeIconView } from "@/components/common/Icon";

interface Props {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <ScrollArea h="100%" type="auto" scrollbarSize={6}>
      <Stack gap={2} p="sm">
        <NavLink
          component={Link}
          href="/"
          label="Dashboard"
          onClick={onNavigate}
          active={isActive("/")}
          variant="filled"
        />
        <NavLink
          component={Link}
          href="/review"
          label="Mistake review"
          onClick={onNavigate}
          active={isActive("/review")}
          variant="filled"
        />

        <Text
          size="xs"
          tt="uppercase"
          fw={700}
          c="dimmed"
          mt="md"
          mb={4}
          px="sm"
        >
          Game modes
        </Text>

        {GAME_MODES.map((mode) => {
          const href = `/practice/${mode.slug}`;
          const ready = mode.status === "ready";
          return (
            <NavLink
              key={mode.id}
              component={Link}
              href={ready ? href : "#"}
              label={mode.title}
              description={mode.tagline}
              onClick={ready ? onNavigate : (e) => e.preventDefault()}
              active={ready && isActive(href)}
              variant="filled"
              disabled={!ready}
              leftSection={
                <span style={{ color: `var(--mantine-color-${mode.accent}-6)` }}>
                  <GameModeIconView name={mode.icon} size={18} />
                </span>
              }
              rightSection={
                ready ? null : (
                  <Badge size="xs" variant="default" color="gray" radius="sm">
                    soon
                  </Badge>
                )
              }
            />
          );
        })}
      </Stack>
    </ScrollArea>
  );
}
