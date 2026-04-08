import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardBody,
  Spinner,
  Pagination,
  Input,
  Select,
  SelectItem,
  Button,
  Avatar,
  Chip,
  useDisclosure,
} from "@heroui/react";
import { LuFileText, LuDownload, LuMessageCircleMore, LuEye } from "react-icons/lu";
import { ContributionService } from "@/api/services/contribution-service";
import { useSelectedContributions } from "../hooks/useSelectedContributions";
import { useCategories } from "@/features/coordinator/contributions/hooks/useCategories";
import { useAcademicYears } from "@/features/student/submissions/hooks/useAcademicYears";
import { CommentDialog } from "@/features/coordinator/contributions/components/CommentDialog";
import { ContributionDetailDialog } from "./ContributionDetailDialog";
import { formatDate } from "@/utils/helpers";
import { toast } from "react-toastify";
import defaultCoverPhoto from "../../../../../public/default-cover-image.jpg";

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("");

const stringToHue = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
};

const SearchIcon = () => (
  <svg className="w-4 h-4 text-default-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const SelectedContributionCard = ({ item, onCommentClick, onDetailClick, onDownload }) => {
  const name = item.user?.name || "";
  const hue = stringToHue(name);
  const hasCoverPhoto = item.cover_photo_url;
  const coverPhotoSrc = hasCoverPhoto ? item.cover_photo_url : defaultCoverPhoto;

  return (
    <div className="rounded-2xl border border-default-200 dark:border-default-700 bg-content1 hover:border-default-300 dark:hover:border-default-600 hover:shadow-sm transition-all duration-150 overflow-hidden">
      <div className="relative h-32 w-full overflow-hidden">
        <img
          src={coverPhotoSrc}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Chip
          color="success"
          size="sm"
          variant="solid"
          classNames={{ base: "absolute top-2 right-2 font-medium text-xs" }}
        >
          Selected
        </Chip>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {hasCoverPhoto ? null : (
            <Avatar
              name={getInitials(name)}
              size="sm"
              classNames={{ base: "shrink-0 text-white font-bold text-[11px] rounded-xl" }}
              style={{ background: `hsl(${hue}, 52%, 48%)` }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate leading-snug">
              {item.title || "Untitled"}
            </p>
            <p className="text-xs text-default-400 dark:text-default-500 truncate mt-0.5">
              {name || "Unknown student"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.category?.name && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-default-100 dark:bg-default-800 text-default-600 dark:text-default-400">
              {item.category.name}
            </span>
          )}
          {item.faculty?.name && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-default-100 dark:bg-default-800 text-default-600 dark:text-default-400">
              {item.faculty.name}
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] text-default-400 dark:text-default-500 bg-default-50 dark:bg-default-900">
            {formatDate(item.created_at)}
          </span>
        </div>

        <div className="pt-3 border-t border-default-100 dark:border-default-800 flex items-center gap-2">
          {item.file_url ? (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<DownloadIcon />}
              onPress={() => onDownload(item)}
              className="h-7 text-xs font-medium px-3"
            >
              Download
            </Button>
          ) : (
            <span className="text-xs text-default-300 dark:text-default-600 italic">No file</span>
          )}

          <Button
            size="sm"
            variant="light"
            color="primary"
            isIconOnly
            aria-label="View details"
            onPress={() => onDetailClick(item)}
          >
            <LuEye size={18} />
          </Button>

          {/* <Button
            size="sm"
            variant="light"
            color="primary"
            isIconOnly
            aria-label="View comments"
            onPress={() => onCommentClick(item)}
            className="ml-auto"
          >
            <LuMessageCircleMore size={18} />
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export const SelectedContributionsList = () => {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [academicYearFilter, setAcademicYearFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedContribution, setSelectedContribution] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onOpenChange: onDetailOpenChange } = useDisclosure();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categoryParam = categoryFilter === "all" ? null : categoryFilter;
  const academicYearParam = academicYearFilter === "all" ? null : academicYearFilter;
  const searchParam = debouncedSearch || null;

  const { data, isLoading, isError, error } = useSelectedContributions(page, categoryParam, academicYearParam, searchParam);
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: academicYearsData, isLoading: academicYearsLoading } = useAcademicYears(1);

  const contributions = data?.data ?? [];
  const currentPage = data?.meta?.current_page ?? 1;
  const lastPage = data?.meta?.last_page ?? 1;
  const total = data?.meta?.total ?? 0;

  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.data ?? [];
    return [
      { key: "all", label: "All Categories" },
      ...categories.map((cat) => ({ key: String(cat.id), label: cat.name })),
    ];
  }, [categoriesData]);

  const academicYearOptions = useMemo(() => {
    const academicYears = academicYearsData?.data ?? [];
    return [
      { key: "all", label: "All Academic Years" },
      ...academicYears.map((year) => ({ key: String(year.id), label: year.name })),
    ];
  }, [academicYearsData]);

  const handleCommentClick = (contribution) => {
    setSelectedContribution(contribution);
    onOpen();
  };

  const handleDetailClick = (contribution) => {
    setSelectedContribution(contribution);
    onDetailOpen();
  };

  const handleDownload = async (contribution) => {
    try {
      const blob = await ContributionService.downloadContribution(contribution.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        contribution.file_url?.split("/").pop() || `contribution-${contribution.id}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      toast.error("Failed to download file. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-sm text-default-400 tracking-wide">Loading selected contributions...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="max-w-md w-full border border-danger-200 dark:border-danger-800">
          <CardBody className="py-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-danger-50 dark:bg-danger-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <p className="font-semibold text-foreground">
              Failed to load contributions
            </p>
            <p className="text-sm text-default-400">
              {error?.message || "An unexpected error occurred."}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Selected Contributions
          </h1>
          {total > 0 && (
            <p className="mt-0.5 text-sm text-default-400">
              {total} selected contribution{total !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <p className="text-xs text-default-400 max-w-md">
          These are contributions that have been selected by coordinators. You can view details and download files.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search by title..."
          value={searchQuery}
          onValueChange={(v) => { setSearchQuery(v); }}
          isClearable
          onClear={() => { setSearchQuery(""); }}
          startContent={<SearchIcon />}
          size="sm"
          variant="bordered"
          classNames={{
            base: "flex-1",
            inputWrapper: "bg-content1 border-default-200 dark:border-default-700",
          }}
        />

        <Select
          placeholder="Academic Year"
          isLoading={academicYearsLoading}
          selectedKeys={new Set([academicYearFilter])}
          onSelectionChange={(keys) => {
            setAcademicYearFilter(Array.from(keys)[0] ?? "all");
            setPage(1);
          }}
          size="sm"
          variant="bordered"
          aria-label="Filter by academic year"
          scrollShadowProps={{ visibility: "top" }}
          popoverProps={{
            classNames: {
              content: "max-w-[300px]",
            },
          }}
          classNames={{
            base: "w-full sm:w-auto sm:min-w-[220px]",
            trigger: "bg-content1 border-default-200 dark:border-default-700",
            value: "text-xs sm:text-sm truncate",
            listbox: "max-h-64",
          }}
        >
          {academicYearOptions.map((y) => (
            <SelectItem key={y.key} className="whitespace-normal">
              {y.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          placeholder="Category"
          isLoading={categoriesLoading}
          selectedKeys={new Set([categoryFilter])}
          onSelectionChange={(keys) => {
            setCategoryFilter(Array.from(keys)[0] ?? "all");
            setPage(1);
          }}
          size="sm"
          variant="bordered"
          aria-label="Filter by category"
          classNames={{
            base: "w-full sm:w-auto sm:min-w-[160px]",
            trigger: "bg-content1 border-default-200 dark:border-default-700",
          }}
        >
          {categoryOptions.map((c) => (
            <SelectItem key={c.key}>{c.label}</SelectItem>
          ))}
        </Select>
      </div>

      {contributions.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-default-400">
          <LuFileText size={40} className="opacity-40" />
          <p className="text-sm font-medium">No selected contributions found</p>
          <p className="text-xs">Contributions selected by coordinators will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contributions.map((item) => (
            <SelectedContributionCard
              key={item.id}
              item={item}
              onCommentClick={handleCommentClick}
              onDetailClick={handleDetailClick}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-default-400 order-2 sm:order-1">
            Page {currentPage} of {lastPage}
          </p>
          <div className="order-1 sm:order-2">
            <Pagination
              total={lastPage}
              page={currentPage}
              onChange={setPage}
              showControls
              color="primary"
              variant="flat"
              classNames={{ item: "font-medium text-sm", cursor: "font-bold" }}
            />
          </div>
        </div>
      )}

      {/* <CommentDialog
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedContribution(null);
          onOpenChange(open);
        }}
        contribution={selectedContribution}
      /> */}

      <ContributionDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedContribution(null);
          onDetailOpenChange(open);
        }}
        contribution={selectedContribution}
      />
    </div>
  );
};