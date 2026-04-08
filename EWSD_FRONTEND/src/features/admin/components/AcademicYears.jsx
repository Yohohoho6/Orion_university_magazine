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
  Pagination,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  LuPlus,
  LuPencil,
  LuPower,
  LuPowerOff,
  LuEllipsisVertical,
} from "react-icons/lu";
import {
  useAcademicYears,
  useUpdateAcademicYearStatus,
} from "../hooks/useAcademicYears";
import { AcademicYearFormModal } from "./AcademicYearFormModal";

const columns = [
  { key: "number", label: "#" },
  { key: "name", label: "Name" },
  { key: "start_date", label: "Start Date" },
  { key: "end_date", label: "End Date" },
  { key: "closure_date", label: "Closure Date" },
  { key: "final_closure_date", label: "Final Closure" },
  { key: "is_active", label: "Status" },
  { key: "actions", label: "Actions" },
];

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString();
};

export const AcademicYears = () => {
  const [page, setPage] = useState(1);
  const { data, isPending } = useAcademicYears(page);

  // Form modal (create / edit)
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const [editingYear, setEditingYear] = useState(null);

  // Status change confirmation modal
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();
  const [statusAction, setStatusAction] = useState(null);

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateAcademicYearStatus(() => {
      setStatusAction(null);
      onConfirmClose();
    });

  const academicYears = data?.data ?? [];
  const totalPages = data?.last_page ?? 1;

  const handleCreate = () => {
    setEditingYear(null);
    onFormOpen();
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    onFormOpen();
  };

  const handleStatusClick = (year, isActive) => {
    setStatusAction({ year, isActive });
    onConfirmOpen();
  };

  const handleConfirmStatus = () => {
    if (statusAction) {
      updateStatus({
        id: statusAction.year.id,
        isActive: statusAction.isActive,
      });
    }
  };

  const handleDropdownAction = (key, year) => {
    switch (key) {
      case "edit":
        handleEdit(year);
        break;
      case "activate":
        handleStatusClick(year, true);
        break;
      case "deactivate":
        handleStatusClick(year, false);
        break;
    }
  };

  const renderCell = (year, columnKey) => {
    switch (columnKey) {
      case "start_date":
      case "end_date":
      case "closure_date":
      case "final_closure_date":
        return formatDate(year[columnKey]);
      case "is_active":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={year.is_active ? "success" : "default"}
          >
            {year.is_active ? "Active" : "Inactive"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-center items-center">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <LuEllipsisVertical size={18} className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Academic year actions"
                onAction={(key) => handleDropdownAction(key, year)}
              >
                <DropdownItem
                  key="edit"
                  startContent={<LuPencil size={16} />}
                >
                  Edit
                </DropdownItem>
                {year.is_active ? (
                  <DropdownItem
                    key="deactivate"
                    color="danger"
                    className="text-danger"
                    startContent={<LuPowerOff size={16} />}
                  >
                    Deactivate
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="activate"
                    color="success"
                    className="text-success"
                    startContent={<LuPower size={16} />}
                  >
                    Activate
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return year[columnKey];
    }
  };

  const isActivating = statusAction?.isActive === true;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Academic Year Management</h1>
        <Button
          className="bg-linear-to-r from-[#1e3a8a] to-[#1e3a8a] text-white"
          startContent={<LuPlus size={18} />}
          onPress={handleCreate}
        >
          Create New
        </Button>
      </div>
      <Table
        aria-label="Academic year list table"
        isStriped
        selectionMode="none"
        bottomContent={
          totalPages > 1 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            </div>
          )
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" || column.key === "number" ? "center" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={academicYears}
          isLoading={isPending}
          loadingContent={<Spinner label="Loading academic years..." />}
          emptyContent="No academic years found."
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => {
                const rowIndex = academicYears.indexOf(item);
                return (
                  <TableCell>
                    {columnKey === "number" ? rowIndex + 1 : renderCell(item, columnKey)}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create / Edit Academic Year Modal */}
      <AcademicYearFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setEditingYear(null);
          onFormClose();
        }}
        academicYear={editingYear}
      />

      {/* Status Change Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} size="sm">
        <ModalContent>
          <ModalHeader>
            {isActivating ? "Confirm Activation" : "Confirm Deactivation"}
          </ModalHeader>
          <ModalBody>
            {isActivating ? (
              <p>
                Are you sure you want to activate{" "}
                <strong>{statusAction?.year?.name}</strong>? This will
                deactivate all other academic years.
              </p>
            ) : (
              <p>
                Are you sure you want to deactivate{" "}
                <strong>{statusAction?.year?.name}</strong>?
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onConfirmClose}>
              Cancel
            </Button>
            <Button
              color={isActivating ? "success" : "danger"}
              onPress={handleConfirmStatus}
              isLoading={isUpdatingStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus
                ? isActivating
                  ? "Activating..."
                  : "Deactivating..."
                : isActivating
                  ? "Activate"
                  : "Deactivate"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
