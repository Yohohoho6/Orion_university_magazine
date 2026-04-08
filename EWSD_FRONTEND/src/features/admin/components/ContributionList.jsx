import { useState, useMemo, useEffect } from "react";
import {
  Chip,
  Spinner,
  Card,
  CardBody,
  Pagination,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Button,
  Avatar,
} from "@heroui/react";
import { useContributions } from "@/features/coordinator/contributions/hooks/useContributions";
import { useCategories } from "@/features/coordinator/contributions/hooks/useCategories";
import { formatDate } from "@/utils/helpers";
import { CommentDialog } from "@/features/coordinator/contributions/components/CommentDialog";
import { LuMessageCircleMore } from "react-icons/lu";
import { ContributionService } from "@/api/services/contribution-service";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

/* ─── Constants ─── */
const STATUS_CONFIG = {
  pending:  { color: "warning",  label: "Pending"  },
  commented:{ color: "primary",   label: "Commented"},
  selected: { color: "success",label: "Selected" },
  rejected: { color: "danger",   label: "Rejected" },
};

const STATUS_OPTIONS = [
  { key: "all",       label: "All Statuses" },
  { key: "pending",   label: "Pending" },
  { key: "selected",  label: "Selected" },
  { key: "rejected",  label: "Rejected" },
  { key: "commented", label: "Commented" },
];

const getStatusConfig = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.default;

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("");

const stringToHue = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
};

/* ─── Icons ─── */
const SearchIcon = () => (
  <svg className="w-4 h-4 text-default-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 4h18M7 8h10M11 12h2" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

/* ─────────────────────────────────────────
   Compact filter bar
───────────────────────────────────────── */
const InlineFilters = ({
  searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  categoryFilter, setCategoryFilter,
  categoryOptions, categoriesLoading,
  setPage,
}) => {
  const [open, setOpen] = useState(false);
  const hasActiveFilters = statusFilter !== "all" || categoryFilter !== "all";

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Search by title, student…"
          value={searchQuery}
          onValueChange={(v) => { setSearchQuery(v); setPage(1); }}
          isClearable
          onClear={() => { setSearchQuery(""); setPage(1); }}
          startContent={<SearchIcon />}
          size="sm"
          variant="bordered"
          classNames={{
            base: "flex-1",
            inputWrapper: "bg-content1 border-default-200 dark:border-default-700",
          }}
        />
        <div className="relative shrink-0">
          <Button
            size="sm"
            variant={open ? "solid" : "bordered"}
            color={open ? "primary" : "default"}
            startContent={<FilterIcon />}
            onPress={() => setOpen((v) => !v)}
            className="font-medium"
          >
            Filters
          </Button>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary border-2 border-background" />
          )}
        </div>
      </div>

      {open && (
        <div className="flex flex-col sm:flex-row gap-2 animate-in slide-in-from-top-1 duration-150">
          <Select
            placeholder="Status"
            selectedKeys={new Set([statusFilter])}
            onSelectionChange={(keys) => {
              setStatusFilter(Array.from(keys)[0] ?? "all");
              setPage(1);
            }}
            size="sm"
            variant="bordered"
            aria-label="Filter by status"
            classNames={{
              base: "flex-1",
              trigger: "bg-content1 border-default-200 dark:border-default-700",
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.key}>{s.label}</SelectItem>
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
              base: "flex-1",
              trigger: "bg-content1 border-default-200 dark:border-default-700",
            }}
          >
            {categoryOptions.map((c) => (
              <SelectItem key={c.key}>{c.label}</SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Single contribution card (read-only)
───────────────────────────────────────── */
const ContributionCard = ({ item, onCommentClick, onDownload }) => {
  const statusCfg = getStatusConfig(item.status);
  const name = item.user?.name || "";
  const hue = stringToHue(name);

  return (
    <div className="rounded-2xl border border-default-200 dark:border-default-700 bg-content1 hover:border-default-300 dark:hover:border-default-600 hover:shadow-sm transition-all duration-150 p-4">

      {/* ── Row 1: cover photo thumbnail · title + student · status ── */}
      <div className="flex items-start gap-3">
        {/* Cover photo or avatar fallback */}
        {item.cover_photo_url ? (
          <img
            src={item.cover_photo_url}
            alt={item.title}
            className="w-10 h-10 rounded-xl object-cover shrink-0"
          />
        ) : (
          <Avatar
            name={getInitials(name)}
            size="sm"
            classNames={{ base: "shrink-0 text-white font-bold text-[11px] rounded-xl" }}
            style={{ background: `hsl(${hue}, 52%, 48%)` }}
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-default-900 dark:text-default-50 truncate leading-snug">
            {item.title || "Untitled"}
          </p>
          <p className="text-xs text-default-400 dark:text-default-500 truncate mt-0.5">
            {name || "Unknown student"}
          </p>
        </div>

        <Chip
          color={statusCfg.color}
          size="sm"
          variant="flat"
          startContent={
            <span className={`w-1.5 h-1.5 rounded-full -ml-0.5 mr-0.5`} />
          }
          classNames={{ base: "font-medium shrink-0 text-xs" }}
        >
          {statusCfg.label}
        </Chip>
      </div>

      {/* ── Row 2: meta pills ── */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.category?.name && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-default-100 dark:bg-default-800 text-default-600 dark:text-default-400">
            {item.category.name}
          </span>
        )}
        {item.academic_year?.name && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-default-100 dark:bg-default-800 text-default-600 dark:text-default-400">
            {item.academic_year.name}
          </span>
        )}
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] text-default-400 dark:text-default-500 bg-default-50 dark:bg-default-900">
          {formatDate(item.created_at)}
        </span>
      </div>

      {/* ── Row 3: actions ── */}
      <div className="mt-3 pt-3 border-t border-default-100 dark:border-default-800 flex items-center gap-2">
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
          aria-label="View comments"
          onPress={() => onCommentClick(item)}
          className="ml-auto"
        >
          <LuMessageCircleMore size={18} />
        </Button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Main component
═══════════════════════════════════════════ */
export const Contributions = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedContribution, setSelectedContribution] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const statusParam   = statusFilter   === "all" ? null : statusFilter;
  const categoryParam = categoryFilter === "all" ? null : categoryFilter;
  const searchParam   = debouncedSearch || null;

  const { data, isLoading, isError, error } = useContributions(page, statusParam, categoryParam, searchParam);
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  let contributions = data?.data ?? [];
  const currentPage = data?.meta?.current_page ?? 1;
  const lastPage    = data?.meta?.last_page    ?? 1;
  const total       = data?.meta?.total        ?? 0;

  if (user.role?.name === "marketing_manager") {
    contributions = contributions.filter((c) => c.status === "selected");
  }

  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.data ?? [];
    return [
      { key: "all", label: "All Categories" },
      ...categories.map((cat) => ({ key: String(cat.id), label: cat.name })),
    ];
  }, [categoriesData]);

  const activeFiltersCount = useMemo(() =>
    [statusFilter !== "all", categoryFilter !== "all", debouncedSearch !== ""].filter(Boolean).length,
    [statusFilter, categoryFilter, debouncedSearch]
  );

  const handleCommentClick = (contribution) => {
    setSelectedContribution(contribution);
    onOpen();
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
    } catch {
      toast.error("Failed to download file. Please try again.");
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-sm text-default-400 tracking-wide">Loading contributions…</p>
      </div>
    );
  }

  /* ── Error ── */
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
            <p className="font-semibold text-default-800 dark:text-default-100">
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

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-default-900 dark:text-default-50">
            Contributions
          </h1>
          {total > 0 && (
            <p className="mt-0.5 text-sm text-default-400">
              {total} submission{total !== 1 ? "s" : ""}
              {activeFiltersCount > 0 && (
                <span className="ml-1 text-primary font-medium">
                  · {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
                </span>
              )}
            </p>
          )}
        </div>

        {/* Status summary pills */}
        <div className="flex flex-wrap gap-2">
          {["pending", "commented", "selected", "rejected"].map((s) => {
            const cfg = getStatusConfig(s);
            const count = contributions.filter((c) => c.status === s).length;
            return (
              <div
                key={s}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                           bg-default-100 dark:bg-default-800
                           border border-default-200 dark:border-default-700
                           text-[11px] font-medium text-default-500 dark:text-default-400"
              >
                <span className={`w-1.5 h-1.5 rounded-full`} />
                {cfg.label}
                <span className="font-bold text-default-800 dark:text-default-100">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filters ── */}
      <InlineFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categoryOptions={categoryOptions}
        categoriesLoading={categoriesLoading}
        setPage={setPage}
      />

      {/* ── Card grid ── */}
      {contributions.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-default-400">
          <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">No contributions found</p>
          <p className="text-xs">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contributions.map((item, index) => (
            <ContributionCard
              key={item.id}
              item={item}
              index={index}
              onCommentClick={handleCommentClick}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
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

      <CommentDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        contribution={selectedContribution}
      />
    </div>
  );
};