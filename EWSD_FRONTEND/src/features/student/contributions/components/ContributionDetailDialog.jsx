import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Avatar,
} from "@heroui/react";
import {
  LuDownload,
  LuFileText,
  LuCalendar,
  LuFolder,
  LuUser,
  LuGraduationCap,
} from "react-icons/lu";
import { formatDate, resolveProfileImageUrl } from "@/utils/helpers";
import { ContributionService } from "@/api/services/contribution-service";
import { AISummary } from "./AISummary";
import { toast } from "react-toastify";

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

export function ContributionDetailDialog({
  contribution,
  isOpen,
  onOpenChange,
}) {
  if (!contribution) return null;

  const handleDownload = async () => {
    try {
      const blob = await ContributionService.downloadContribution(contribution.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = contribution.file_url?.split("/").pop() || `contribution-${contribution.id}`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "border border-divider bg-background shadow-xl rounded-2xl",
        header: "border-b border-divider pb-4",
        footer: "border-t border-divider pt-4",
        closeButton: "hover:bg-default-100 rounded-full transition-colors",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <LuFileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-default-900">
                {contribution.title}
              </h2>
              <p className="text-sm text-default-500 font-normal mt-0.5">
                Contribution Details
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="py-6">
          {/* Cover Image */}
          {contribution.cover_photo_url && (
            <div className="relative h-54 w-full rounded-xl mb-6">
              <img
                src={contribution.cover_photo_url}
                alt={contribution.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </div>
          )}

          {/* Status and Meta */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Chip
              size="sm"
              color={getStatusColor(contribution.status)}
              variant={getStatusVariant(contribution.status)}
              classNames={{
                content: "text-xs font-semibold capitalize",
              }}
            >
              {contribution.status}
            </Chip>
            {contribution.academic_year && (
              <Chip
                size="sm"
                variant="flat"
                color="secondary"
                startContent={<LuGraduationCap className="w-3.5 h-3.5" />}
              >
                {contribution.academic_year.name}
              </Chip>
            )}
            {contribution.category && (
              <Chip
                size="sm"
                variant="flat"
                color="primary"
                startContent={<LuFolder className="w-3.5 h-3.5" />}
              >
                {contribution.category.name}
              </Chip>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-default-700 mb-2 flex items-center gap-2">
              <LuFileText className="w-4 h-4" />
              Description
            </h3>
            <div className="p-4 bg-default-50 rounded-xl border border-default-100">
              <p className="text-default-600 leading-relaxed whitespace-pre-wrap">
                {contribution.description}
              </p>
            </div>
          </div>

          {/* AI Summary */}
          {isOpen && contribution.id && (
            <AISummary contributionId={contribution.id} />
          )}

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Author */}
            {contribution.user && (
              <div className="p-4 bg-default-50 rounded-xl border border-default-100">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={contribution.user.name}
                    src={resolveProfileImageUrl(contribution.user.profile_path)}
                    size="md"
                    className="bg-primary/20 text-primary font-semibold"
                  />
                  <div>
                    <p className="text-xs text-default-500 uppercase tracking-wide">
                      Author
                    </p>
                    <p className="text-sm font-semibold text-default-900">
                      {contribution.user.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Faculty */}
            {contribution.faculty && (
              <div className="p-4 bg-default-50 rounded-xl border border-default-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <LuUser className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-default-500 uppercase tracking-wide">
                      Faculty
                    </p>
                    <p className="text-sm font-semibold text-default-900">
                      {contribution.faculty.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Created Date */}
            <div className="p-4 bg-default-50 rounded-xl border border-default-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/20 rounded-lg">
                  <LuCalendar className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-default-500 uppercase tracking-wide">
                    Created
                  </p>
                  <p className="text-sm font-semibold text-default-900">
                    {formatDate(contribution.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Updated Date */}
            <div className="p-4 bg-default-50 rounded-xl border border-default-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 rounded-lg">
                  <LuCalendar className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-default-500 uppercase tracking-wide">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-default-900">
                    {formatDate(contribution.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* File Download Section */}
          {contribution.file_url && (
            <div className="mt-6 p-5 bg-linear-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <LuFileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-default-900">
                      Attached File
                    </p>
                    <p className="text-xs text-default-500">
                      Click to download the submission document
                    </p>
                  </div>
                </div>
                <Button
                  color="primary"
                  startContent={<LuDownload className="w-4 h-4" />}
                  onPress={handleDownload}
                  className="font-semibold"
                >
                  Download
                </Button>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="flat"
            onPress={() => onOpenChange(false)}
            className="font-semibold"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}