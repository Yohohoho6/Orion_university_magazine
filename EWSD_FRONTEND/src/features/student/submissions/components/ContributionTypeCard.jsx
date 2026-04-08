"use client";

import { Card, CardBody } from "@heroui/react";

export function ContributionTypeCard({
  icon,
  title,
  description,
  bullets,
  isSelected,
  onSelect,
}) {
  return (
    <Card
      isPressable
      onPress={onSelect}
      className={`transition-all ${
        isSelected
          ? "border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40 shadow-md"
          : "border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
      }`}
      shadow="none"
      radius="lg"
    >
      <CardBody className="p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <span className="[&>svg]:h-8 [&>svg]:w-8 sm:[&>svg]:h-10 sm:[&>svg]:w-10">
            {icon}
          </span>
        </div>
        <h3 className="mb-1.5 sm:mb-2 text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
        <ul className="flex flex-col gap-1 sm:gap-1.5">
          {bullets.map((bullet, i) => (
            <li key={i} className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {"- "}{bullet}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}