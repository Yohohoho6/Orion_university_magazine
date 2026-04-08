import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { FaChartBar } from "react-icons/fa";
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate, TREND_COLORS, getIsoWeek } from "@/utils/helpers";

const SubmissionTrendChart = ({ submissionTrend }) => {
  const trendChartData = useMemo(() => {
    if (!submissionTrend) return [];

    return [...submissionTrend]
      .map((item, index) => {
        const weekStart = item.week ?? null;
        const rawWeekNumber =
          item.week_number ?? getIsoWeek(item.week) ?? index + 1;
        const weekNumber = Number(rawWeekNumber) || index + 1;

        return {
          weekNumber,
          submissions: item.count ?? 0,
          weekStart,
          weekLabel: weekStart
            ? `${formatDate(weekStart)} (W${weekNumber})`
            : `W${weekNumber}`,
        };
      })
      .sort((a, b) => {
        if (a.weekStart && b.weekStart) {
          return new Date(a.weekStart) - new Date(b.weekStart);
        }
        return a.weekNumber - b.weekNumber;
      });
  }, [submissionTrend]);

  return (
    <Card className="shadow-sm border border-default-200 lg:col-span-full">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <FaChartBar />
          <p className="font-semibold text-sm">Submissions (last 8 weeks)</p>
        </div>
      </CardHeader>
      <CardBody className="space-y-2">
        {trendChartData.length === 0 ? (
          <p className="text-sm text-default-500">No trend data yet.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendChartData}
                margin={{ top: 5, right: 8, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" vertical={false} />
                <XAxis
                  dataKey="weekLabel"
                  stroke="var(--color-text-3)"
                  tickFormatter={(value, index) =>
                    trendChartData[index]?.weekLabel ?? `W${value}`
                  }
                />
                <YAxis
                  allowDecimals={false}
                  stroke="var(--color-text-3)"
                  label={{ value: "Submissions", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-border-3)", opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: "var(--color-surface-raised)",
                    border: "none",
                    color: "var(--color-text-1)",
                  }}
                  itemStyle={{ color: "var(--color-text-2)" }}
                  labelStyle={{ color: "var(--color-text-1)" }}
                  formatter={(value) => [value, "Submissions"]}
                  labelFormatter={(label) => label}
                />
                <Bar
                  dataKey="submissions"
                  name="Submissions"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                >
                  {trendChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={TREND_COLORS[index % TREND_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SubmissionTrendChart;
