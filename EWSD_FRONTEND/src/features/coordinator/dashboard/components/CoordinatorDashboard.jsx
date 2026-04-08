import { Chip } from "@heroui/react";
import { CiCircleCheck } from "react-icons/ci";
import { FaCircleXmark } from "react-icons/fa6";
import { FiAlertTriangle } from "react-icons/fi";
import {
  LuCalendarDays,
  LuClock3,
  LuFileText,
  LuMessageSquare,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useCoordinatorDashboard } from "../hooks/useCoordinatorDashboard";
import StatCard from "./StatCard";
import ErrorState from "./ErrorState";
import LoadingGrid from "./LoadingGrid";
import DeadlinesCard from "./DeadlinesCard";
import TopCategoriesCard from "./TopCategoriesCard";
import StatusPieChart from "./StatusPieChart";
import SubmissionTrendChart from "./SubmissionTrendChart";
import LatestSubmissionsCard from "./LatestSubmissionsCard";
import OldestPendingCard from "./OldestPendingCard";
import { WelcomeBanner } from "@/components/welcome-banner/WelcomeBanner";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useCoordinatorDashboard();

  const totals = data?.totals ?? {};
  const pending = totals.pending ?? 0;
  const selected = totals.selected ?? 0;
  const rejected = totals.rejected ?? 0;
  const commented = totals.commented ?? 0;
  const overdue = data?.overdue_count ?? 0;
  const total = pending + selected + rejected + commented;

  const latest = data?.latest_contributions ?? [];
  const oldestPending = data?.oldest_pending ?? [];
  const statusDistribution = data?.status_distribution ?? [];
  const submissionTrend = data?.submission_trend ?? [];
  const topCategories = data?.top_categories ?? [];
  const academicYear = data?.academic_year;

  const goToContributions = (status, search) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);

    const query = params.toString();
    navigate(
      `/marketing-coordinator/contributions${query ? `?${query}` : ""}`
    );
  };

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Unexpected error"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Marketing Coordinator Dashboard</h1>
          <p className="text-sm text-default-500">
            Academic Year: {academicYear?.name ?? "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {academicYear?.final_closure_date && (
            <Chip
              variant="flat"
              color="primary"
              startContent={<LuCalendarDays size={16} />}
            >
              Final closure {academicYear.final_closure_date}
            </Chip>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingGrid />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            label="Total"
            value={total}
            color="bg-primary"
            icon={LuFileText}
            onPress={() => goToContributions()}
          />
          <StatCard
            label="Pending"
            value={pending}
            color="bg-warning"
            icon={LuClock3}
            onPress={() => goToContributions("pending")}
          />
          <StatCard
            label="Commented"
            value={commented}
            color="bg-secondary"
            icon={LuMessageSquare}
            onPress={() => goToContributions("commented")}
          />
          <StatCard
            label="Selected"
            value={selected}
            color="bg-success"
            icon={CiCircleCheck}
            onPress={() => goToContributions("selected")}
          />
          <StatCard
            label="Rejected"
            value={rejected}
            color="bg-danger"
            icon={FaCircleXmark}
            onPress={() => goToContributions("rejected")}
          />
          <StatCard
            label="Overdue (14d+)"
            value={overdue}
            color="bg-danger"
            icon={FiAlertTriangle}
            onPress={() => goToContributions("pending")}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <DeadlinesCard academicYear={academicYear} />
        <TopCategoriesCard topCategories={topCategories} />
        <StatusPieChart statusDistribution={statusDistribution} />
        <SubmissionTrendChart submissionTrend={submissionTrend} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LatestSubmissionsCard latest={latest} onNavigate={goToContributions} />
        <OldestPendingCard oldestPending={oldestPending} onNavigate={goToContributions} />
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
