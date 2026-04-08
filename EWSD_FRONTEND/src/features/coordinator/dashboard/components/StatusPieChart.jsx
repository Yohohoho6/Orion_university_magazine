import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { FaChartBar } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { STATUS_PIE_COLORS, TREND_COLORS, RADIAN } from "@/utils/helpers";

const StatusPieChart = ({ statusDistribution }) => {
  const statusPieData = useMemo(() => {
    if (!statusDistribution) return [];

    return statusDistribution
      .map((item, index) => {
        const statusKey =
          typeof item.status === "string" ? item.status.toLowerCase() : "unknown";
        const name =
          typeof item.status === "string"
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : "Unknown";
        const color =
          STATUS_PIE_COLORS[statusKey] ||
          TREND_COLORS[index % TREND_COLORS.length] ||
          "var(--color-border-3)";
        return {
          name,
          status: statusKey,
          value: item.count ?? 0,
          color,
          fill: color,
        };
      })
      .filter((item) => item.value > 0);
  }, [statusDistribution]);

  const statusTotal = useMemo(
    () => statusDistribution.reduce((sum, item) => sum + (item.count ?? 0), 0),
    [statusDistribution]
  );

  const statusLegendPayload = useMemo(
    () =>
      statusPieData.map((item) => ({
        value: `${item.name} (${item.value})`,
        id: item.status,
        type: "circle",
        color: item.color,
      })),
    [statusPieData]
  );

  const renderStatusLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    if (!percent) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="var(--color-text-1)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name ?? ""} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="shadow-sm border border-default-200 lg:col-span-2">
      <CardHeader className="pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaChartBar />
          <p className="font-semibold text-sm">Status distribution</p>
        </div>
        <p className="text-xs text-default-500">Total: {statusTotal}</p>
      </CardHeader>
      <CardBody className="space-y-2">
        {statusTotal === 0 ? (
          <p className="text-sm text-default-500">No data yet.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface-raised)",
                    border: "none",
                  }}
                  itemStyle={{ color: "var(--color-text-2)" }}
                  labelStyle={{ color: "var(--color-text-1)" }}
                  formatter={(value, name) => [value, name]}
                />
                <Legend payload={statusLegendPayload} />
                <Pie
                  data={statusPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  labelLine={false}
                  label={renderStatusLabel}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}-${index}`}
                      fill={entry.color || TREND_COLORS[index % TREND_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default StatusPieChart;
