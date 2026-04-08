import React, { useState } from "react";
import { useGetDashboardData } from "../hooks/useGetDashboardReports";
import {
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Button,
  Avatar,
} from "@heroui/react";
import {
  LuUsers,
  LuFileText,
  LuBuilding2,
  LuSchool,
  LuTrophy,
  LuTrendingUp,
  LuCheck,
  LuClock,
  LuDownload,
} from "react-icons/lu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { resolveProfileImageUrl } from "@/utils/helpers";
import { axiosInstance } from "@/api/axios-instance";
import { toast } from "react-toastify";
import { WelcomeBanner } from "@/components/welcome-banner/WelcomeBanner";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  "#378ADD",
  "#1D9E75",
  "#7F77DD",
  "#639922",
  "#D85A30",
  "#BA7517",
];

const CARD_COLORS = [
  { bg: "bg-[#185FA5]", text: "text-[#E6F1FB]" },
  { bg: "bg-[#0F6E56]", text: "text-[#E1F5EE]" },
  { bg: "bg-[#853450]", text: "text-[#FBEAF0]" },
  { bg: "bg-[#6B4AB7]", text: "text-[#EEEDFE]" },
  { bg: "bg-[#BA7517]", text: "text-[#FAEEDA]" },
  { bg: "bg-[#3B6D11]", text: "text-[#EAF3DE]" },
];

const STAT_THEMES = {
  blue: {
    card: "bg-[#E6F1FB]",
    label: "text-[#185FA5]",
    val: "text-[#0C447C]",
    icon: "bg-[#B5D4F4] text-[#185FA5]",
  },
  teal: {
    card: "bg-[#E1F5EE]",
    label: "text-[#0F6E56]",
    val: "text-[#085041]",
    icon: "bg-[#9FE1CB] text-[#0F6E56]",
  },
  green: {
    card: "bg-[#EAF3DE]",
    label: "text-[#3B6D11]",
    val: "text-[#27500A]",
    icon: "bg-[#C0DD97] text-[#3B6D11]",
  },
  amber: {
    card: "bg-[#FAEEDA]",
    label: "text-[#854F0B]",
    val: "text-[#633806]",
    icon: "bg-[#FAC775] text-[#854F0B]",
  },
  purple: {
    card: "bg-[#EEEDFE]",
    label: "text-[#534AB7]",
    val: "text-[#3C3489]",
    icon: "bg-[#CECBF6] text-[#534AB7]",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const triggerBlobDownload = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ label, value, color, icon }) => {
  const t = STAT_THEMES[color];
  return (
    <div className={`${t.card} rounded-xl p-4 flex flex-col gap-2.5`}>
      <div
        className={`${t.icon} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className={`text-[11px] font-medium ${t.label}`}>{label}</p>
        <p className={`text-[22px] font-medium leading-tight ${t.val}`}>
          {value?.toLocaleString() ?? 0}
        </p>
      </div>
    </div>
  );
};

const ChartTooltip = ({ active, payload, label, suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-default-100 dark:border-slate-700 rounded-lg shadow-sm p-2.5 text-xs">
      <p className="font-medium text-default-700 dark:text-slate-200 mb-0.5">
        {label || payload[0].name}
      </p>
      <p className="text-default-500 dark:text-slate-400">
        {payload[0].value} {suffix}
      </p>
    </div>
  );
};

const ContributorRankBadge = ({ index }) => {
  const styles = [
    "bg-[#FAC775] text-[#633806]",
    "bg-[#D3D1C7] text-[#2C2C2A]",
    "bg-[#F5C4B3] text-[#712B13]",
  ];
  return (
    <span
      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${styles[index] ?? "bg-default-100 dark:bg-slate-700 text-default-400 dark:text-slate-400"}`}
    >
      {index + 1}
    </span>
  );
};

const trophyColor = (i) =>
  i === 0 ? "#BA7517" : i === 1 ? "#888780" : "#993C1D";

// ─── Main Component ───────────────────────────────────────────────────────────

export const ManagerDashboard = () => {
  const { data: dashboardData, isPending } = useGetDashboardData();

  const [loadingFaculty, setLoadingFaculty] = useState({});

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" label="Loading dashboard..." />
      </div>
    );
  }

  const {
    summary: { total_contributions, total_students },
    academic_year,
    faculty_performance,
    top_contributors,
    monthly_trend,
    status_distribution,
  } = dashboardData;

  const selectedCount =
    status_distribution.find((s) => s.status === "selected")?.count ?? 0;
  const pendingCount =
    status_distribution.find((s) => s.status === "pending")?.count ?? 0;

  const barChartData = faculty_performance.map((f) => ({
    name: f.name,
    contributions: f.total_contributions,
  }));
  const pieChartData = faculty_performance.map((f) => ({
    name: f.name,
    value: f.contributor_count,
  }));

  // ── GET /contributions/faculty/{faculty_id}/download-zip ──
  const handleDownloadFaculty = async (facultyId, facultyName) => {
    setLoadingFaculty((prev) => ({ ...prev, [facultyId]: true }));
    try {
      const res = await axiosInstance.get(
        `/contributions/faculty/${facultyId}/download-zip`,
        { responseType: "blob" },
      );
      triggerBlobDownload(
        res.data,
        `${facultyName.replace(/\s+/g, "_")}_contributions.zip`,
      );
    } catch (err) {
      console.error("Faculty ZIP download failed:", err);

      let errorMessage = "Failed to download faculty contributions";

      // Check if the error response is a Blob
      if (err.response?.data instanceof Blob) {
        // Read the Blob as text
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            toast.error(errorData.message || errorMessage);
          } catch {
            toast.error(errorMessage);
          }
        };
        reader.readAsText(err.response.data);
      } else {
        // Fallback for non-blob errors
        toast.error(err.response?.data?.message || errorMessage);
      }
    } finally {
      setLoadingFaculty((prev) => ({ ...prev, [facultyId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <WelcomeBanner />
      {/* ── Header ── */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-medium text-foreground">
            University overview
          </h1>
          <p className="text-xs text-default-400 mt-0.5">
            Academic Year: {academic_year.name}
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="Total students"
          value={total_students}
          color="blue"
          icon={<LuUsers size={14} />}
        />
        <StatCard
          label="Total contributions"
          value={total_contributions}
          color="teal"
          icon={<LuFileText size={14} />}
        />
        <StatCard
          label="Selected"
          value={selectedCount}
          color="green"
          icon={<LuCheck size={14} />}
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          color="amber"
          icon={<LuClock size={14} />}
        />
        <StatCard
          label="Faculties"
          value={faculty_performance.length}
          color="purple"
          icon={<LuBuilding2 size={14} />}
        />
      </div>

      {/* ── Charts row 1: Bar + Donut ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="border border-default-100 shadow-none">
          <CardHeader className="text-[13px] font-medium pb-1">
            Contributions by faculty
          </CardHeader>
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={barChartData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ReTooltip content={<ChartTooltip suffix="contributions" />} />
                <Bar dataKey="contributions" radius={[4, 4, 0, 0]}>
                  {barChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="border border-default-100 shadow-none">
          <CardHeader className="text-[13px] font-medium pb-1">
            Contributors by faculty
          </CardHeader>
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="value"
                  labelLine={false}
                >
                  {pieChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip content={<ChartTooltip suffix="contributors" />} />
                <Legend
                  iconType="square"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* ── Charts row 2: Area + Top Contributors ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="border border-default-100 shadow-none">
          <CardHeader className="text-[13px] font-medium flex items-center gap-1.5 pb-1">
            <LuTrendingUp size={14} className="text-[#378ADD]" />
            Monthly trend
          </CardHeader>
          <CardBody className="pt-0">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={monthly_trend}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#378ADD" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#378ADD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ReTooltip content={<ChartTooltip suffix="contributions" />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#378ADD"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={{ r: 3, fill: "#378ADD", strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="border border-default-100 shadow-none">
          <CardHeader className="text-[13px] font-medium flex items-center gap-1.5 pb-1">
            <LuTrophy size={14} className="text-[#BA7517]" />
            Top contributors
          </CardHeader>
          <CardBody className="pt-0 flex flex-col gap-2">
            {top_contributors.length === 0 ? (
              <p className="text-xs text-default-400 text-center py-6">
                No contributors yet
              </p>
            ) : (
              top_contributors.map((contributor, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-default-50 dark:bg-slate-800/50 hover:bg-default-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <ContributorRankBadge index={i} />
                  <Avatar
                    src={resolveProfileImageUrl(contributor.profile_path)}
                    name={contributor.name}
                    size="sm"
                    color="primary"
                    isBordered
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {contributor.name}
                    </p>
                    <p className="text-[11px] text-default-400">
                      {contributor.count} contribution
                      {contributor.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {i < 3 && (
                    <LuTrophy size={14} style={{ color: trophyColor(i) }} />
                  )}
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      {/* ── Faculty Statistics ── */}
      <div>
        <h2 className="text-[15px] font-medium text-foreground mb-3">
          Faculty statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {faculty_performance.map((faculty, i) => {
            const pct =
              faculty.total_contributions > 0
                ? Math.round(
                    (faculty.selected_count / faculty.total_contributions) *
                      100,
                  )
                : 0;
            const { bg, text } = CARD_COLORS[i % CARD_COLORS.length];
            const isDownloading = loadingFaculty[faculty.id] ?? false;

            return (
              <Card
                key={faculty.id}
                className={`${bg} ${text} border-0 overflow-hidden relative`}
              >
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-4 right-6 w-14 h-14 rounded-full bg-white/10 pointer-events-none" />

                <CardHeader className="flex items-center gap-2 pb-2 relative z-10">
                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                    <LuSchool size={13} />
                  </div>
                  <p className="text-[12px] font-medium leading-tight flex-1 min-w-0 truncate">
                    {faculty.name}
                  </p>
                </CardHeader>

                <CardBody className="pt-0 flex flex-col gap-3 relative z-10">
                  {/* Progress bar */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] opacity-65">
                        Selection rate
                      </span>
                      <span className="text-[10px] font-medium opacity-90">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-0.75 rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white/80 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex divide-x divide-white/20">
                    {[
                      { value: faculty.total_contributions, label: "Total" },
                      { value: faculty.selected_count, label: "Selected" },
                      { value: faculty.contributor_count, label: "Students" },
                    ].map(({ value, label }) => (
                      <div
                        key={label}
                        className="flex-1 flex flex-col gap-0.5 px-2.5 first:pl-0 last:pr-0"
                      >
                        <span className="text-[17px] font-medium leading-none">
                          {value}
                        </span>
                        <span className="text-[10px] opacity-60">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Per-faculty download button */}
                  <Button
                    size="sm"
                    variant="flat"
                    isLoading={isDownloading}
                    startContent={!isDownloading && <LuDownload size={12} />}
                    onPress={() =>
                      handleDownloadFaculty(faculty.id, faculty.name)
                    }
                    className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/20 text-[11px] font-medium"
                  >
                    {isDownloading ? "Preparing ZIP..." : "Download ZIP"}
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
