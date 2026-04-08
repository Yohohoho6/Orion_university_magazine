import { Chip } from "@heroui/react";
import { daysUntil } from "@/utils/helpers";

const DeadlineRow = ({ label, date, color }) => {
  if (!date) return null;
  const daysLeft = daysUntil(date);
  const urgent = daysLeft !== null && daysLeft <= 7;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-default-100">
      <div>
        <p className="text-xs text-default-500">{label}</p>
        <p className="text-sm font-semibold">{date}</p>
      </div>
      <Chip
        size="sm"
        color={urgent ? "danger" : color}
        variant={urgent ? "flat" : "bordered"}
      >
        {daysLeft > 0
          ? `${daysLeft}d left`
          : daysLeft === 0
          ? "Today"
          : `${Math.abs(daysLeft)}d ago`}
      </Chip>
    </div>
  );
};

export default DeadlineRow;
