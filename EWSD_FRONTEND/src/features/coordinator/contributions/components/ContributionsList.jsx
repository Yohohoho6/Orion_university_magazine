import { useMemo, useState } from "react";
import {
  Chip,
  Spinner,
  Card,
  CardBody,
  Pagination,
  useDisclosure,
  Button,
  Avatar,
  Checkbox,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/helpers";
import { ActionsCell } from "./ActionsCell";
import { BulkActionsBar } from "./BulkActionsBar";
import { CommentDialog } from "./CommentDialog";
import { AISummaryDialog } from "./AISummaryDialog";

import { useContributions } from "../hooks/useContributions";
import { useCategories } from "../hooks/useCategories";
import { useSelectContributions } from "../hooks/useSelectContributions";
import { useContributionFilters } from "../hooks/useContributionFilters";
import { ContributionService } from "@/api/services/contribution-service";

const TERMINAL_STATUSES = ["selected", "rejected"];

const STATUS_CONFIG = {
  selected: { color: "success",  label: "Selected" },
  rejected: { color: "danger",     label: "Rejected" },
  pending:  { color: "warning",   label: "Pending"  },
  commented:  { color: "default",    label: "Commented"  },
};

const STATUS_OPTIONS = [
  { key: "all",      label: "All Statuses" },
  { key: "pending",  label: "Pending" },
  { key: "selected", label: "Selected" },
  { key: "rejected", label: "Rejected" },
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
const DownloadIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-default-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 4h18M7 8h10M11 12h2M9 16h6" />
  </svg>
);

/* ─────────────────────────────────────────────────────────
   Inline filter bar — compact, wraps nicely on all screens
───────────────────────────────────────────────────────── */
const InlineFilters = ({ filters, categoryOptions, categoriesLoading }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* Search + filter toggle row */}
      <div className="flex gap-2">
        <Input
          placeholder="Search contributions…"
          value={filters.searchQuery ?? ""}
          onValueChange={filters.setSearch}
          startContent={<SearchIcon />}
          size="sm"
          variant="bordered"
          classNames={{
            base: "flex-1",
            inputWrapper: "bg-content1 dark:bg-content1 border-default-200 dark:border-default-700",
          }}
          isClearable
        />
        <Button
          size="sm"
          variant={open ? "solid" : "bordered"}
          color={open ? "primary" : "default"}
          startContent={<FilterIcon />}
          onPress={() => setOpen((v) => !v)}
          className="shrink-0 font-medium"
        >
          Filters
          {/* Active dot if any filter is set */}
          {(filters.statusFilter !== "all" || filters.categoryFilter !== "all") && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1 right-1" />
          )}
        </Button>
      </div>

      {/* Collapsible dropdowns */}
      {open && (
        <div className="flex flex-col sm:flex-row gap-2 animate-in slide-in-from-top-1 duration-150">
          <Select
            placeholder="Status"
            selectedKeys={filters.statusParam ? new Set([filters.statusParam]) : new Set(["all"])}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0];
              filters.setStatus(val === "all" ? "" : val);
            }}
            size="sm"
            variant="bordered"
            aria-label="Filter by status"
            classNames={{
              base: "flex-1",
              trigger: "bg-content1 dark:bg-content1 border-default-200 dark:border-default-700",
            }}
          >
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.key}>{s.label}</SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Category"
            isLoading={categoriesLoading}
            selectedKeys={
              filters.categoryParam ? new Set([filters.categoryParam]) : new Set(["all"])
            }
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0];
              filters.setCategory(val === "all" ? "" : val);
            }}
            size="sm"
            variant="bordered"
            aria-label="Filter by category"
            classNames={{
              base: "flex-1",
              trigger: "bg-content1 dark:bg-content1 border-default-200 dark:border-default-700",
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
   Single contribution card
───────────────────────────────────────── */
const ContributionCard = ({
  item,
  isSelected,
  isDisabled,
  onToggle,
  onDropdownAction,
  onCommentClick,
  onAISummaryClick,
  onDownload,
}) => {
  const statusCfg = getStatusConfig(item.status);
  const name = item.user?.name || "";
  const hue = stringToHue(name);

  return (
    <div
      className={`
        group relative rounded-2xl border p-4 transition-all duration-150 cursor-default
        ${isSelected
          ? "border-primary/60 bg-primary-50 dark:bg-primary-950/40 shadow-sm shadow-primary/10"
          : "border-default-200 dark:border-default-700 bg-content1 hover:border-default-300 dark:hover:border-default-600 hover:shadow-sm"
        }
        ${isDisabled ? "opacity-55" : ""}
      `}
    >
      {/* ── Row 1: checkbox · avatar+name · status ── */}
      <div className="flex items-center gap-3">
        {/* Checkbox — hidden for terminal items */}
        <div className="shrink-0 w-5 flex items-center justify-center">
          {!isDisabled && (
            <Checkbox
              isSelected={isSelected}
              onValueChange={onToggle}
              size="sm"
            />
          )}
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar
            name={getInitials(name)}
            size="sm"
            classNames={{ base: "shrink-0 text-white font-bold text-[11px]" }}
            style={{ background: `hsl(${hue}, 52%, 48%)` }}
          />
          <div className="min-w-0">
            <p className="text-xs text-default-400 dark:text-default-500 leading-none mb-0.5 truncate">
              {name || "Unknown"}
            </p>
            <p className="font-semibold text-sm text-foreground truncate leading-snug">
              {item.title || "Untitled"}
            </p>
          </div>
        </div>

        {/* Status chip */}
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

      {/* ── Row 2: meta tags ── */}
      <div className="mt-3 ml-8 flex flex-wrap gap-1.5">
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

      {/* ── Row 3: divider + actions ── */}
      <div className="mt-3 ml-8 pt-3 border-t border-default-100 dark:border-default-800 flex items-center gap-2">
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
          <span className="text-xs text-default-400 dark:text-default-500 italic">No file</span>
        )}

        <div className="ml-auto">
          <ActionsCell
            contribution={item}
            onDropdownAction={onDropdownAction}
            onCommentClick={onCommentClick}
            onAISummaryClick={onAISummaryClick}
          />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Main page component
═══════════════════════════════════════════ */
export const ContributionsList = () => {
  const filters = useContributionFilters();
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [summaryContribution, setSummaryContribution] = useState(null);
  const { isOpen: isSummaryOpen, onOpen: onSummaryOpen, onOpenChange: onSummaryOpenChange } = useDisclosure();

  const { data, isLoading, isError, error } = useContributions(
    filters.page,
    filters.statusParam,
    filters.categoryParam,
    filters.searchParam
  );

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { mutate: selectContributions } = useSelectContributions();

  const contributions = useMemo(() => data?.data ?? [], [data?.data]);
  const currentPage = data?.meta?.current_page ?? 1;
  const lastPage = data?.meta?.last_page ?? 1;
  const totalItems = data?.meta?.total ?? 0;

  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.data ?? [];
    return [
      { key: "all", label: "All Categories" },
      ...categories.map((cat) => ({ key: String(cat.id), label: cat.name })),
    ];
  }, [categoriesData]);

  const handleSelectContributions = ({ ids, action }) => {
    const actualIds =
      ids === "all"
        ? contributions
            .filter((c) => !TERMINAL_STATUSES.includes(c.status))
            .map((c) => String(c.id))
        : Array.from(ids);

    if (actualIds.length === 0) {
      toast.error("No contributions selected");
      return;
    }

    selectContributions(
      { ids: actualIds, action },
      {
        onSuccess: (res) => {
          toast.success(res.message || `Contributions ${action} successfully`);
          setSelectedKeys(new Set());
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || `Failed to ${action} contributions`);
        },
      }
    );
  };

  const handleBulkSelect = () =>
    handleSelectContributions({ ids: selectedKeys, action: "selected" });
  const handleBulkReject = () =>
    handleSelectContributions({ ids: selectedKeys, action: "rejected" });

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

  const handleDropdownAction = (key, contribution) =>
    handleSelectContributions({
      ids: [contribution.id],
      action: key === "select" ? "selected" : "rejected",
    });

  const handleCommentClick = (contribution) => {
    setSelectedContribution(contribution);
    onOpen();
  };

  const handleAISummaryClick = (contribution) => {
    setSummaryContribution(contribution);
    onSummaryOpen();
  };

  const toggleCard = (id) =>
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(String(id)) ? next.delete(String(id)) : next.add(String(id));
      return next;
    });

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-sm text-default-500 dark:text-default-400 tracking-wide">Loading contributions…</p>
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

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1">
            Review Portal
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Contributions
          </h1>
          {totalItems > 0 && (
            <p className="mt-0.5 text-sm text-default-400">
              {totalItems} submission{totalItems !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2">
          {["pending", "selected", "rejected"].map((s) => {
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
                <span className="font-bold text-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Compact filters ── */}
      <InlineFilters
        filters={filters}
        categoryOptions={categoryOptions}
        categoriesLoading={categoriesLoading}
      />

      {/* ── Bulk actions ── */}
      {selectedKeys.size > 0 && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <BulkActionsBar
            count={selectedKeys.size}
            onBulkSelect={handleBulkSelect}
            onBulkReject={handleBulkReject}
            onClear={() => setSelectedKeys(new Set())}
          />
        </div>
      )}

      {/* ── Card grid ── */}
      {contributions.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-default-400 dark:text-default-500">
          <div className="w-16 h-16 rounded-full bg-default-100 dark:bg-default-800 flex items-center justify-center">
            <svg className="w-8 h-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-default-600 dark:text-default-300">No contributions found</p>
          <p className="text-xs text-default-400 dark:text-default-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contributions.map((item) => (
            <ContributionCard
              key={item.id}
              item={item}
              isSelected={selectedKeys.has(String(item.id))}
              isDisabled={TERMINAL_STATUSES.includes(item.status)}
              onToggle={() => toggleCard(item.id)}
              onDropdownAction={handleDropdownAction}
              onCommentClick={handleCommentClick}
              onAISummaryClick={handleAISummaryClick}
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
              onChange={filters.setPage}
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

      <AISummaryDialog
        isOpen={isSummaryOpen}
        onOpenChange={onSummaryOpenChange}
        contribution={summaryContribution}
      />
    </div>
  );
};