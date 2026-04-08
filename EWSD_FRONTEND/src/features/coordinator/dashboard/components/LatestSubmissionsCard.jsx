import { Card, CardBody, CardHeader } from "@heroui/react";
import { LuClock3 } from "react-icons/lu";
import { formatDate } from "@/utils/helpers";
import ListItem from "./ListItem";

const LatestSubmissionsCard = ({ latest, onNavigate }) => {
  return (
    <Card className="shadow-sm border border-default-200">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <LuClock3 />
          <p className="font-semibold text-sm">Latest submissions</p>
        </div>
      </CardHeader>
      <CardBody className="divide-y divide-default-100">
        {latest.length === 0 ? (
          <p className="text-sm text-default-500">No submissions yet.</p>
        ) : (
          latest.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              subtitle={`${item.student_name} - ${formatDate(
                item.created_at
              )}`}
              status={item.status}
              createdAt={item.created_at}
              onOpen={() => onNavigate(undefined, item.title)}
            />
          ))
        )}
      </CardBody>
    </Card>
  );
};

export default LatestSubmissionsCard;
