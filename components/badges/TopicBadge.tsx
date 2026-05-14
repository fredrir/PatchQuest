import { Badge, Tooltip } from "@mantine/core";
import { COURSE_TOPIC_META, type CourseTopic } from "@/domain/topic";

interface Props {
  topic: CourseTopic;
  variant?: "light" | "filled" | "outline" | "dot";
  size?: "xs" | "sm" | "md" | "lg";
}

export function TopicBadge({ topic, variant = "light", size = "sm" }: Props) {
  const meta = COURSE_TOPIC_META[topic];
  return (
    <Tooltip label={meta.description} withArrow openDelay={300}>
      <Badge color={meta.color} variant={variant} size={size} radius="sm">
        {meta.short}
      </Badge>
    </Tooltip>
  );
}
