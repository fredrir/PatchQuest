import { Badge } from "@mantine/core";
import { DIFFICULTY_META, type Difficulty } from "@/domain/difficulty";

interface Props {
  difficulty: Difficulty;
  size?: "xs" | "sm" | "md" | "lg";
}

export function DifficultyBadge({ difficulty, size = "sm" }: Props) {
  const meta = DIFFICULTY_META[difficulty];
  return (
    <Badge color={meta.color} variant="outline" size={size} radius="sm">
      {meta.label}
    </Badge>
  );
}
