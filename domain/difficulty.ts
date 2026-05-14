export const DIFFICULTIES = ["intro", "core", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface DifficultyMeta {
  readonly id: Difficulty;
  readonly label: string;
  readonly color: string;
  readonly weight: number;
}

export const DIFFICULTY_META: Record<Difficulty, DifficultyMeta> = {
  intro: { id: "intro", label: "Intro", color: "lime", weight: 1 },
  core: { id: "core", label: "Core", color: "ntnuBlue", weight: 2 },
  advanced: { id: "advanced", label: "Advanced", color: "magenta", weight: 3 },
};
