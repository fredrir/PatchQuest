"use client";

import { usePersistentState } from "./usePersistentState";
import type { CourseTopic } from "@/domain/topic";
import type { Difficulty } from "@/domain/difficulty";

export interface AppSettings {
  examMode: boolean;
  topicFilter: readonly CourseTopic[]; // empty = all
  difficultyFilter: readonly Difficulty[]; // empty = all
}

const DEFAULTS: AppSettings = {
  examMode: false,
  topicFilter: [],
  difficultyFilter: [],
};

export function useSettings() {
  const [settings, setSettings, reset] = usePersistentState<AppSettings>(
    "settings",
    DEFAULTS,
  );

  return {
    settings,
    setExamMode: (examMode: boolean) =>
      setSettings((s) => ({ ...s, examMode })),
    setTopicFilter: (topicFilter: readonly CourseTopic[]) =>
      setSettings((s) => ({ ...s, topicFilter })),
    setDifficultyFilter: (difficultyFilter: readonly Difficulty[]) =>
      setSettings((s) => ({ ...s, difficultyFilter })),
    reset,
  };
}
