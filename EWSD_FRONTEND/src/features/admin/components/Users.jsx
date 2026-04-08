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
  LuBan,
  LuShieldCheck,
  LuEllipsisVertical,
} from "react-icons/lu";
import { useUsers } from "../hooks/useUsers";
import { useUpdateUserStatus } from "../hooks/useSuspendUser";
import { UserFormModal } from "./UserFormModal";
import  {formatDate}  from "@/utils/helpers";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "faculty", label: "Faculty" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
  { key: "actions", label: "Actions" },
];

const statusColorMap = {
  active: "success",
  suspended: "warning"
};

export const Users = () => {
  const [page, setPage] = useState(1);
  const { data, isPending } = useUsers(page);

  // Form modal (create / edit)
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const [editingUser, setEditingUser] = useState(null);

  // Status change confirmation modal
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();
  const [statusAction, setStatusAction] = useState(null);

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateUserStatus(() => {
      setStatusAction(null);
      onConfirmClose();
    });

  const users = data?.data ?? [];
  const totalPages = data?.last_page ?? 1;

  const handleCreate = () => {
    setEditingUser(null);
    onFormOpen();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    onFormOpen();
  };

  const handleStatusClick = (user, newStatus) => {
    setStatusAction({ user, newStatus });
    onConfirmOpen();
  };

  const handleConfirmStatus = () => {
    if (statusAction) {
      updateStatus({
        id: statusAction.user.id,
        status: statusAction.newStatus,
      });
    }
  };

  const handleDropdownAction = (key, user) => {
    switch (key) {
      case "edit":
        handleEdit(user);
        break;
      case "suspend":
        handleStatusClick(user, "suspended");
        break;
      case "activate":
        handleStatusClick(user, "active");
        break;
    }
  };

  const renderCell = (user, columnKey) => {
    switch (columnKey) {
      case "role":
        return user.role ? (
          <Chip size="sm" variant="flat" color="primary">
            {user.role.name}
          </Chip>
        ) : (
          "—"
        );
      case "faculty":
        return user.faculty?.name ?? "—";
      case "status":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={statusColorMap[user.status] || "default"}
          >
            {user.status}
          </Chip>
        );
      case "created_at":
        return formatDate(user.created_at);
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
                aria-label="User actions"
                onAction={(key) => handleDropdownAction(key, user)}
              >
                <DropdownItem
                  key="edit"
                  startContent={<LuPencil size={16} />}
                >
                  Edit
                </DropdownItem>
                {user.status === "suspended" ? (
                  <DropdownItem
                    key="activate"
                    color="success"
                    className="text-success"
                    startContent={<LuShieldCheck size={16} />}
                  >
                    Activate
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="suspend"
                    color="danger"
                    className="text-danger"
                    startContent={<LuBan size={16} />}
                  >
                    Suspend
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return user[columnKey];
    }
  };

  const isSuspending = statusAction?.newStatus === "suspended";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button
          className="bg-linear-to-r from-[#1e3a8a] to-[#1e3a8a] text-white"
          startContent={<LuPlus size={18} />}
          onPress={handleCreate}
        >
          Create New
        </Button>
      </div>
      <Table
        aria-label="User list table"
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
              align={column.key === "actions" ? "center" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={users}
          isLoading={isPending}
          loadingContent={<Spinner label="Loading users..." />}
          emptyContent="No users found."
        >
          {(user) => (
            <TableRow key={user.id}>
              {(columnKey) => (
                <TableCell>{renderCell(user, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Create / Edit User Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setEditingUser(null);
          onFormClose();
        }}
        user={editingUser}
      />

      {/* Status Change Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} size="sm">
        <ModalContent>
          <ModalHeader>
            {isSuspending ? "Confirm Suspension" : "Confirm Activation"}
          </ModalHeader>
          <ModalBody>
            {isSuspending ? (
              <p>
                Are you sure you want to suspend{" "}
                <strong>{statusAction?.user?.name}</strong>? This will revoke
                their access to the system.
              </p>
            ) : (
              <p>
                Are you sure you want to activate{" "}
                <strong>{statusAction?.user?.name}</strong>? This will restore
                their access to the system.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onConfirmClose}>
              Cancel
            </Button>
            <Button
              color={isSuspending ? "danger" : "success"}
              onPress={handleConfirmStatus}
              isLoading={isUpdatingStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus
                ? isSuspending
                  ? "Suspending..."
                  : "Activating..."
                : isSuspending
                  ? "Suspend User"
                  : "Activate User"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
