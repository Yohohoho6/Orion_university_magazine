import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { useFaculties } from "../../faculty/hooks/useFaculty";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" }
];

export const Faculties = () => {
  const { data: faculties, isPending } = useFaculties();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Faculty Management</h1>
      <Table aria-label="Faculty list table" isStriped selectionMode="none">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={faculties ?? []}
          isLoading={isPending}
          loadingContent={<Spinner label="Loading faculties..." />}
          emptyContent="No faculties found."
        >
          {(faculty) => (
            <TableRow key={faculty.id}>
              {(columnKey) => (
                <TableCell>{faculty[columnKey]}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
