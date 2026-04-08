import { Card, CardBody, Skeleton } from "@heroui/react";

const LoadingGrid = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
    {[...Array(6).keys()].map((i) => (
      <Card key={i} className="shadow-sm border border-default-200">
        <CardBody className="gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-lg" />
        </CardBody>
      </Card>
    ))}
  </div>
);

export default LoadingGrid;
