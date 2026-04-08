import { Card, CardBody, CardHeader } from "@heroui/react";
import { LuCalendarDays } from "react-icons/lu";
import DeadlineRow from "./DeadlineRow";

const DeadlinesCard = ({ academicYear }) => {
  return (
    <Card className="shadow-sm border border-default-200">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <LuCalendarDays />
          <p className="font-semibold text-sm">Deadlines</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        <DeadlineRow
          label="Closure date"
          date={academicYear?.closure_date}
          color="primary"
        />
        <DeadlineRow
          label="Final closure"
          date={academicYear?.final_closure_date}
          color="danger"
        />
      </CardBody>
    </Card>
  );
};

export default DeadlinesCard;
