import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

const TopCategoriesCard = ({ topCategories }) => {
  return (
    <Card className="shadow-sm border border-default-200">
      <CardHeader className="pb-1">
        <p className="font-semibold text-sm">Top Categories</p>
      </CardHeader>
      <CardBody className="space-y-3">
        {topCategories.length === 0 ? (
          <p className="text-sm text-default-500">No categories yet.</p>
        ) : (
          topCategories.map((item, index) => (
            <div
              key={`${item.category_name}-${index}`}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-default-700">{item.category_name}</span>
              <Chip
                size="sm"
                variant="flat"
                color="default"
                className="bg-default-100 text-default-700"
              >
                {item.count}
              </Chip>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};

export default TopCategoriesCard;
