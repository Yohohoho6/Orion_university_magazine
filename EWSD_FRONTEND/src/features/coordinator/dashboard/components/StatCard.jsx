import { Card, CardBody, Skeleton } from "@heroui/react";

const StatCard = ({ label, value, icon: Icon, color, onPress, loading }) => (
  <Card
    isPressable={!!onPress}
    onPress={onPress}
    className="shadow-sm border border-default-200"
  >
    <CardBody className="flex flex-row items-center gap-4">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${color}`}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wide text-default-500">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-6 w-16 rounded-lg mt-1" />
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
      </div>
    </CardBody>
  </Card>
);

export default StatCard;
