import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Avatar,
  Badge,
  Tooltip,
} from "@heroui/react";
import {
  LuPencilLine,
  LuMessageCircleMore,
  LuCalendar,
  LuFolder,
  LuEye,
} from "react-icons/lu";
import { formatDate } from "@/utils/helpers";
import { useComments } from "@/features/coordinator/contributions/hooks/useComments";
import defaultCoverPhoto from "../../../../../public/default-cover-image.jpg";

const getStatusColor = (status) => {
  const statusColors = {
    pending: "warning",
    commented: "primary",
    selected: "success",
    rejected: "danger",
  };
  return statusColors[status] || "default";
};

const getStatusVariant = (status) => {
  const statusVariants = {
    pending: "flat",
    commented: "solid",
    selected: "solid",
    rejected: "flat",
  };
  return statusVariants[status] || "flat";
};

const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export function ContributionCard({
  contribution,
  onDetailClick,
  onCommentClick,
  onEditClick,
  canEdit = true,
  editDisabledMessage = "",
}) {
  const hasCoverPhoto = contribution?.cover_photo_path;
  const coverPhotoSrc = hasCoverPhoto
    ? `http://localhost:8000/storage/${contribution.cover_photo_path}`
    : defaultCoverPhoto;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border border-default-100">
      {/* Cover Photo */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
        <img
          alt={contribution?.title || "Default cover photo"}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          src={coverPhotoSrc}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      </div>

      <CardHeader>
        <div className="flex w-full justify-between items-center gap-3">
          <div className="flex gap-1 flex-1">
            {/* Title */}
            <p className="text-lg font-semibold text-default-900 line-clamp-1">
              {contribution?.title}
            </p>
          </div>

          {/* Edit Button */}
          <div className="flex gap-1 items-center">
            <Avatar
              icon={<LuEye className="text-default-500" />}
              onClick={onDetailClick}
              size="sm"
              variant="flat"
              className="cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors"
            />
            <Avatar
              icon={<LuMessageCircleMore className="text-primary" />}
              onClick={onCommentClick}
              size="sm"
              variant="flat"
              className="cursor-pointer bg-primary/10 hover:bg-primary/20 transition-colors"
            />
            <Tooltip
              content={
                canEdit
                  ? "Edit contribution"
                  : editDisabledMessage || "Editing is not available"
              }
            >
              <Avatar
                icon={
                  <LuPencilLine
                    className={canEdit ? "text-success" : "text-default-400"}
                  />
                }
                size="sm"
                variant="flat"
                onClick={() => {
                  if (canEdit) {
                    onEditClick?.();
                  }
                }}
                className={`bg-primary/10 transition-colors ${
                  canEdit
                    ? "cursor-pointer hover:bg-primary/20"
                    : "cursor-not-allowed opacity-60"
                }`}
              />
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      <CardBody className="py-2 space-y-3">
        <p className="text-default-600 text-sm leading-relaxed">
          {truncateText(contribution?.description)}
        </p>

        {/* Academic Year Badge */}
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            variant="flat"
            color="secondary"
            classNames={{
              content: "text-xs font-medium",
            }}
          >
            {contribution?.academic_year?.name}
          </Chip>
          <Chip
            size="sm"
            color={getStatusColor(contribution?.status)}
            variant={getStatusVariant(contribution?.status)}
            classNames={{
              content: "text-xs font-medium capitalize",
            }}
          >
            {contribution?.status}
          </Chip>
        </div>
      </CardBody>

      <CardFooter className="flex justify-between items-center py-3 px-4 bg-default-50/50 rounded-b-xl">
        <div className="flex items-center gap-4">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-default-500">
            <LuCalendar size={14} />
            <span className="text-xs">
              {formatDate(contribution?.created_at)}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center gap-1.5 text-default-500">
            <LuFolder size={14} />
            <span className="text-xs">{contribution?.category?.name}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
