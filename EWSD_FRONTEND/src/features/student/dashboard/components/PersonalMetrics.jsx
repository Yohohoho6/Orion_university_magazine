import { Card, CardBody } from "@heroui/react"
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts"

const MetricCard = ({ title, value, color, maxValue = 100 }) => {
    const numericValue = parseFloat(value) || 0
    
    const data = [
        {
            name: title,
            value: numericValue,
            fill: color,
        },
    ]

    return (
        <Card classNames={{
            base: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 !shadow-none"
        }}>
            <CardBody className="flex flex-col items-center justify-center p-6">
                <ResponsiveContainer width="100%" height={180}>
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="90%"
                        barSize={12}
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, maxValue]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                            fill={color}
                        />
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-gray-900 dark:fill-gray-100"
                        >
                            <tspan x="50%" dy="-0.5em" fontSize="28" fontWeight="bold">
                                {typeof value === 'string' && value.includes('%') ? value : numericValue}
                            </tspan>
                        </text>
                    </RadialBarChart>
                </ResponsiveContainer>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {title}
                </h3>
            </CardBody>
        </Card>
    )
}
export const PersonalMetrics = ({ metrics }) => {
    // Ensure metrics has default values
    const safeMetrics = {
        total_submissions: 0,
        selection_rate: 0,
        rejection_rate: 0,
        ...metrics,
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
                title="Total Submissions"
                value={safeMetrics.total_submissions}
                color="#3b82f6"
                maxValue={20}
            />
            <MetricCard
                title="Selection Rate"
                value={safeMetrics.selection_rate}
                color="#10b981"
            />
            <MetricCard
                title="Rejection Rate"
                value={safeMetrics.rejection_rate}
                color="#ef4444"
            />
        </div>
    )
}
