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
import { useGuestList } from "../hooks/useGuestList";
import { formatDate } from "../../../../utils/helpers";

export const GuestList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useGuestList(currentPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Spinner size="lg" label="Loading guests..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="text-danger text-center">
          <p className="text-lg font-semibold">Error loading guests</p>
          <p className="text-sm">{error?.message || "Failed to load guests"}</p>
        </div>
      </div>
    );
  }

  const guests = data?.data || [];
  const pagination = {
    currentPage: data?.current_page,
    lastPage: data?.last_page,
    total: data?.total,
    from: data?.from,
    to: data?.to,
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-6">Guest List</h2>

      <div className="overflow-x-auto">
        <Table aria-label="Guest list table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>FACULTY</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED DATE</TableColumn>
            <TableColumn>UPDATED DATE</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No guests found">
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>{guest.name}</TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell>{guest.faculty?.name}</TableCell>
                <TableCell>
                  <Chip
                    color={guest.status === "active" ? "success" : "danger"}
                    variant="flat"
                    size="sm"
                  >
                    {guest.status}
                  </Chip>
                </TableCell>
                <TableCell>{formatDate(guest.created_at)}</TableCell>
                <TableCell>{formatDate(guest.updated_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.lastPage > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-default-500">
            Showing {pagination.from} to {pagination.to} of {pagination.total} guests
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