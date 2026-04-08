import { Card, CardBody, CardHeader } from "@heroui/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useTheme } from "@/context/ThemeContext"

export const FacultyComparison = ({ comparison, personalMetrics }) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    const data = [
        {
            name: "Selection Rate",
            "Your Rate": parseFloat(personalMetrics?.selection_rate) || 0,
            "Faculty Average": parseFloat(comparison?.average_faculty_selection_rate) || 0,
        },
        {
            name: "Rejection Rate",
            "Your Rate": parseFloat(personalMetrics?.rejection_rate) || 0,
            "Faculty Average": parseFloat(comparison?.average_faculty_rejection_rate) || 0,
        },
    ]

    const tooltipStyle = {
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
        borderRadius: '8px',
        color: isDark ? '#f3f4f6' : '#111827',
    }

    return (
        <Card className="dark:bg-gray-800">
            <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold dark:text-gray-100">Faculty Comparison</h3>
            </CardHeader>
            <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis 
                            dataKey="name" 
                            className="text-sm"
                            tick={{ fill: 'currentColor', className: isDark ? 'fill-gray-300' : 'fill-gray-700' }}
                        />
                        <YAxis 
                            className="text-sm"
                            tick={{ fill: 'currentColor', className: isDark ? 'fill-gray-300' : 'fill-gray-700' }}
                        />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Bar dataKey="Your Rate" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Faculty Average" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your contribution share: <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {comparison?.your_contribution_share}
                        </span>
                    </p>
                </div>
            </CardBody>
        </Card>
    )
}