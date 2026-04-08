import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
} from "@heroui/react";
import { Pagination } from "@heroui/pagination";
import { useStudentList } from "../hooks/useStudentList";
import { formatDate } from "../../../../utils/helpers";

export const StudentList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useStudentList(currentPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Spinner size="lg" label="Loading students..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="text-danger text-center">
          <p className="text-lg font-semibold">Error loading students</p>
          <p className="text-sm">{error?.message || "Failed to load students"}</p>
        </div>
      </div>
    );
  }

  const students = data?.data || [];
  const pagination = {
    currentPage: data?.current_page,
    lastPage: data?.last_page,
    total: data?.total,
    from: data?.from,
    to: data?.to,
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Student List</h2>

      <Table aria-label="Student list table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>FACULTY</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>CREATED DATE</TableColumn>
          <TableColumn>UPDATED DATE</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No students found">
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.faculty?.name}</TableCell>
              <TableCell>
                <Chip
                  color={student.status === "active" ? "success" : "danger"}
                  variant="flat"
                  size="sm"
                >
                  {student.status}
                </Chip>
              </TableCell>
              <TableCell>{formatDate(student.created_at)}</TableCell>
              <TableCell>{formatDate(student.updated_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination.lastPage > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-default-500">
            Showing {pagination.from} to {pagination.to} of {pagination.total} students
          </p>
          <Pagination
            total={pagination.lastPage}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
          />
        </div>
      )}
    </div>
  );
};
