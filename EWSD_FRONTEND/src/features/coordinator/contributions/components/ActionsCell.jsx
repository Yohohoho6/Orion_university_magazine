import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from "@heroui/react";
import { LuEllipsisVertical, LuCheck, LuX, LuMessageCircleMore, LuSparkles } from "react-icons/lu";

const TERMINAL_STATUSES = ["selected", "rejected"];

export const ActionsCell = ({ contribution, onDropdownAction, onCommentClick, onAISummaryClick }) => {
  const isDisabled = TERMINAL_STATUSES.includes(contribution.status);

  return (
    <div className="flex justify-center items-center gap-1">
      <Tooltip content="View AI Summary" placement="top" delay={300} closeDelay={0}>
        <Button
          onPress={() => onAISummaryClick(contribution)}
          isIconOnly
          size="sm"
          variant="light"
          className="hover:bg-secondary-100"
        >
          <LuSparkles
            size={18}
            className="text-secondary"
          />
        </Button>
      </Tooltip>

      <Tooltip content="Add Comment" placement="top" delay={300} closeDelay={0}>
        <Button
          onPress={() => onCommentClick(contribution)}
          isIconOnly
          size="sm"
          variant="light"
          className="hover:bg-primary-100"
        >
          <LuMessageCircleMore
            size={18}
            className="text-primary"
          />
        </Button>
      </Tooltip>

      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            isDisabled={isDisabled}
            className={isDisabled ? "opacity-50" : "hover:bg-warning-100"}
          >
            <LuEllipsisVertical
              size={18}
              className={isDisabled ? "text-gray-300" : "text-warning"}
            />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Contribution actions"
          onAction={(key) => onDropdownAction(key, contribution)}
        >
          <DropdownItem key="select" color="success" className="text-success" startContent={<LuCheck size={16} />}>
            Select
          </DropdownItem>
          <DropdownItem key="reject" color="danger" className="text-danger" startContent={<LuX size={16} />}>
            Reject
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};