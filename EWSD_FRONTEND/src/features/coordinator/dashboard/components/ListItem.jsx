import { Button, Chip } from "@heroui/react";
import { STATUS_COLORS, daysSince } from "@/utils/helpers";

const ListItem = ({
  title,
  subtitle,
  status,
  createdAt,
  onOpen,
  highlight,
}) => {
  const days = daysSince(createdAt);
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-default-500 truncate">{subtitle}</p>
      </div>
      {status && (
        <Chip
          size="sm"
          color={STATUS_COLORS[status] || "default"}
          variant="flat"
          className="capitalize"
        >
          {status}
        </Chip>
      )}
      {days !== null && (
        <Chip
          size="sm"
          color={highlight ? "danger" : "default"}
          variant={highlight ? "flat" : "bordered"}
        >
          {days}d ago
        </Chip>
      )}
      {onOpen && (
        <Button size="sm" variant="light" onPress={onOpen}>
          Open
        </Button>
      )}
    </div>
  );
};

export default ListItem;
