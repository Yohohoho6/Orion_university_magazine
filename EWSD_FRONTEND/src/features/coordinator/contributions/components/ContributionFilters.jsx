import { Input, Select, SelectItem } from "@heroui/react";

const STATUS_OPTIONS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "selected", label: "Selected" },
  { key: "rejected", label: "Rejected" },
  { key: "commented", label: "Commented" },
];

export const ContributionFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  categoryOptions,
  categoriesLoading,
}) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <Input
      placeholder="Search by title, student, or academic year..."
      value={searchQuery}
      onValueChange={onSearchChange}
      isClearable
      onClear={() => onSearchChange("")}
      className="flex-1"
      size="sm"
      variant="bordered"
      aria-label="Search contributions"
    />

    <Select
      label="Status"
      selectedKeys={[statusFilter]}
      onSelectionChange={(keys) => onStatusChange(Array.from(keys)[0])}
      className="w-full sm:w-48"
      size="sm"
      variant="bordered"
      aria-label="Filter by status"
    >
      {STATUS_OPTIONS.map((opt) => (
        <SelectItem key={opt.key}>{opt.label}</SelectItem>
      ))}
    </Select>

    <Select
      label="Category"
      selectedKeys={[categoryFilter]}
      onSelectionChange={(keys) => onCategoryChange(Array.from(keys)[0])}
      className="w-full sm:w-48"
      size="sm"
      variant="bordered"
      isLoading={categoriesLoading}
      aria-label="Filter by category"
    >
      {categoryOptions.map((opt) => (
        <SelectItem key={opt.key}>{opt.label}</SelectItem>
      ))}
    </Select>
  </div>
);