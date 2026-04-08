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
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Avatar,
  Card,
  Input,
  ButtonGroup,
} from "@heroui/react";
import { LuEye, LuMail, LuCalendar, LuUser, LuMessageSquare, LuInbox, LuSearch } from "react-icons/lu";
import { useContacts } from "../hooks/useContacts";
import { useMarkContactAsRead } from "../hooks/useMarkContactAsRead";
import { formatDate } from "@/utils/helpers";

const columns = [
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Sending Date" },
  { key: "actions", label: "Actions" },
];

const statusFilters = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

export const Inbox = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isPending } = useContacts({ search, status });
  const { mutate: markAsRead } = useMarkContactAsRead();

  const contacts = data?.data ?? [];
  const counts = data?.counts ?? { total: 0, unread: 0, read: 0 };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);

    if (!contact.is_read) {
      markAsRead(contact.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const renderCell = (contact, columnKey) => {
    switch (columnKey) {
      case "full_name":
        return <span className="font-medium">{contact.full_name}</span>;
      case "email":
        return <span className="text-default-500">{contact.email}</span>;
      case "subject":
        return (
          <span className="max-w-48 truncate block">{contact.subject}</span>
        );
      case "status":
        return contact.is_read ? (
          <Chip size="sm" variant="flat" color="success">
            Read
          </Chip>
        ) : (
          <Chip size="sm" variant="flat" color="warning">
            New
          </Chip>
        );
      case "created_at":
        return <span className="text-default-400">{formatDate(contact.created_at)}</span>;
      case "actions":
        return (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => handleView(contact)}
          >
            <LuEye size={18} className="text-default-400" />
          </Button>
        );
      default:
        return contact[columnKey];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inbox</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border border-default-100 shadow-none bg-gradient-to-br from-blue-50 to-blue-100/50">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <LuInbox size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-default-500">Total Messages</p>
              <p className="text-xl font-semibold text-default-900">{counts.total}</p>
            </div>
          </div>
        </Card>
        <Card className="border border-default-100 shadow-none bg-gradient-to-br from-amber-50 to-amber-100/50">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <LuMail size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-default-500">Unread</p>
              <p className="text-xl font-semibold text-default-900">{counts.unread}</p>
            </div>
          </div>
        </Card>
        <Card className="border border-default-100 shadow-none bg-gradient-to-br from-green-50 to-green-100/50">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <LuEye size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-default-500">Read</p>
              <p className="text-xl font-semibold text-default-900">{counts.read}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Input
          placeholder="Search by name, email, or subject..."
          value={search}
          onValueChange={setSearch}
          startContent={<LuSearch size={18} className="text-default-400" />}
          className="w-full sm:max-w-xs"
          isClearable
          onClear={() => setSearch("")}
        />
        <ButtonGroup>
          {statusFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={status === filter.key ? "solid" : "light"}
              color={status === filter.key ? "primary" : "default"}
              size="sm"
              onPress={() => setStatus(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <Table
        aria-label="Contact messages table"
        isStriped
        selectionMode="none"
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
          items={contacts}
          isLoading={isPending}
          loadingContent={<Spinner label="Loading messages..." />}
          emptyContent="No messages found."
        >
          {(contact) => (
            <TableRow key={contact.id}>
              {(columnKey) => (
                <TableCell>{renderCell(contact, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-2">
            <span className="text-lg font-semibold">Message Details</span>
            {selectedContact && (
              <div className="flex items-center gap-2 mt-1">
                {selectedContact.is_read ? (
                  <Chip size="sm" variant="flat" color="success">
                    Read
                  </Chip>
                ) : (
                  <Chip size="sm" variant="flat" color="warning">
                    New
                  </Chip>
                )}
              </div>
            )}
          </ModalHeader>
          <Divider />
          <ModalBody className="py-4">
            {selectedContact && (
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <Avatar
                    name={selectedContact.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    className="flex-shrink-0"
                    size="lg"
                    showFallback
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-default-900 truncate">
                        {selectedContact.full_name}
                      </h3>
                      <span className="text-xs text-default-400 flex items-center gap-1 flex-shrink-0">
                        <LuCalendar size={12} />
                        {formatDate(selectedContact.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-default-500 flex items-center gap-1.5 mt-0.5">
                      <LuMail size={14} />
                      {selectedContact.email}
                    </p>
                  </div>
                </div>

                <Divider />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LuMessageSquare size={16} className="text-default-400"/>
                    <span className="text-sm font-medium text-default-600">Subject</span>
                  </div>
                  <p className="text-default-900 font-medium">{selectedContact.subject}</p>
                </div>

                <div className="bg-gradient-to-br from-default-50 to-default-100/50 rounded-xl p-5 border border-default-100">
                  <p className="text-xs text-default-400 uppercase tracking-wide mb-2 font-medium">
                    Message Content
                  </p>
                  <p className="text-default-700 whitespace-pre-wrap leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button variant="light" onPress={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};