import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { useCategories } from "../hooks/useCategories";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "type", label: "Category Type"},
  { key: "description", label: "Description" }
];

export const Categories = () => {
  const { data, isPending } = useCategories();
  const categories = data?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <Table aria-label="Category list table" isStriped selectionMode="none">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={categories}
          isLoading={isPending}
          loadingContent={<Spinner label="Loading categories..." />}
          emptyContent="No categories found."
        >
          {(category) => (
            <TableRow key={category.id}>
              {(columnKey) => (
                <TableCell>{category[columnKey]}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
