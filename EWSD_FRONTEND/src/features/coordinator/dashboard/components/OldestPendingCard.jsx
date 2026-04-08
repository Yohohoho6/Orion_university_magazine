import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { FaChartBar } from "react-icons/fa";
import { formatDate } from "@/utils/helpers";
import ListItem from "./ListItem";

const OldestPendingCard = ({ oldestPending, onNavigate }) => {
  return (
    <Card className="shadow-sm border border-default-200">
      <CardHeader className="pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaChartBar />
          <p className="font-semibold text-sm">Oldest pending</p>
        </div>
        <Button
          size="sm"
          variant="light"
          onPress={() => onNavigate("pending")}
        >
          Review all
        </Button>
      </CardHeader>
      <CardBody className="divide-y divide-default-100">
        {oldestPending.length === 0 ? (
          <p className="text-sm text-default-500">No pending items.</p>
        ) : (
          oldestPending.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.student_name} - ${formatDate(
                item.created_at
              )}`}
              status={item.status}
              createdAt={item.created_at}
              highlight
              onOpen={() => onNavigate(undefined, item.title)}
            />
          ))
        )}
      </CardBody>
    </Card>
  );
};

export default OldestPendingCard;
