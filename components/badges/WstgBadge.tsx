import { Badge, Tooltip } from "@mantine/core";
import { OWASP_WSTG, type OwaspWstgId } from "@/domain/owasp";

export function WstgBadge({ id }: { id: OwaspWstgId }) {
  return (
    <Tooltip label={OWASP_WSTG[id]} withArrow openDelay={250}>
      <Badge variant="outline" color="gray" size="sm" radius="sm" tt="none">
        {id}
      </Badge>
    </Tooltip>
  );
}
