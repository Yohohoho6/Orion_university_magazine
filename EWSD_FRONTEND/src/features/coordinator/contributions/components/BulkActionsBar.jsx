import { Button, Chip } from "@heroui/react";
import { LuCheck, LuX } from "react-icons/lu";
import { motion } from "framer-motion";

export const BulkActionsBar = ({ count, totalSelectable, onBulkSelect, onBulkReject, onClear }) => {
  if (count === 0) return null;

  // Decide action text dynamically
  const selectText =
    count === totalSelectable
      ? "Select All"
      : `Select (${count}) contributions`;

  const rejectText =
    count === totalSelectable
      ? "Reject All"
      : `Reject (${count}) contributions`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 px-4 py-2.5 bg-primary-50 border border-primary-200 rounded-lg transition-all duration-200"
    >
      <Chip size="sm" color="primary" variant="flat">
        {count} selected
      </Chip>

      <div className="h-4 w-px bg-primary-200" />

      <Button
        size="sm"
        color="success"
        variant="flat"
        startContent={<LuCheck size={14} />}
        onPress={onBulkSelect}
      >
        {selectText}
      </Button>

      <Button
        size="sm"
        color="danger"
        variant="flat"
        startContent={<LuX size={14} />}
        onPress={onBulkReject}
      >
        {rejectText}
      </Button>

      <Button
        size="sm"
        variant="light"
        startContent={<LuX size={14} />}
        onPress={onClear}
        className="ml-auto text-gray-500"
      >
        Clear Selection
      </Button>
    </motion.div>
  );
};