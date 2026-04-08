import { Button, Card, CardBody } from "@heroui/react";

const ErrorState = ({ message, onRetry }) => (
  <Card className="border border-danger-200 bg-danger-50">
    <CardBody className="flex flex-col gap-3 text-danger-700">
      <div className="flex items-center gap-2 font-semibold">
        Failed to load dashboard
      </div>
      <p className="text-sm">{message}</p>
      <Button color="danger" variant="flat" size="sm" onPress={onRetry}>
        Retry
      </Button>
    </CardBody>
  </Card>
);

export default ErrorState;
