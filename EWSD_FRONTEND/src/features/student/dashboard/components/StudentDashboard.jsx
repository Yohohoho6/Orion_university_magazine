import { Spinner, Button } from "@heroui/react"
import { FiRefreshCw } from "react-icons/fi"
import { useStudentDashboard } from "../hooks/useStudentDashboard"
import { AcademicYearBanner } from "./AcademicYearBanner"
import { ActionButtons } from "./ActionButtons"
import { PersonalMetrics } from "./PersonalMetrics"
import { FacultyComparison } from "./FacultyComparison"
import { StatusBreakdown } from "./StatusBreakdown"
import { RecentActivity } from "./RecentActivity"
import { NotificationsPanel } from "./NotificationsPanel"
import { WelcomeBanner } from "@/components/welcome-banner/WelcomeBanner"

// Error fallback component with retry functionality
const ErrorFallback = ({ error, onRetry }) => (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
            <div className="mb-4">
                <svg
                    className="mx-auto h-12 w-12 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Failed to load dashboard
            </h3>
            <p className="text-gray-500 text-sm mb-4">{error?.message || "An unexpected error occurred"}</p>
            <Button
                color="primary"
                startContent={<FiRefreshCw />}
                onPress={onRetry}
            >
                Try Again
            </Button>
        </div>
    </div>
)

export const StudentDashboard = () => {
    const { data, isLoading, error, refetch } = useStudentDashboard()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" label="Loading dashboard..." />
            </div>
        )
    }

    if (error) {
        return <ErrorFallback error={error} onRetry={refetch} />
    }

    // Defensive data validation with defaults
    const safeData = {
        academic_year: null,
        student_info: { name: "Student", faculty: "" },
        personal_metrics: {},
        faculty_comparison: {},
        status_breakdown: {},
        recent_activity: [],
        notifications: [],
        ...data,
    }

    return (        <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-2">
            <div className="max-w-full space-y-6">
                <WelcomeBanner />
                {/* Top Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex-1 w-full md:w-auto">
                        <AcademicYearBanner academicYear={safeData.academic_year} />
                    </div>
                    <ActionButtons />
                </div>

                {/* Student Info
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Welcome, {safeData.student_info?.name || "Student"}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {safeData.student_info?.faculty || ""}
                    </p>
                </div> */}

                {/* Personal Metrics */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Your Performance</h2>
                    <PersonalMetrics metrics={safeData.personal_metrics} />
                </section>

                {/* Faculty Comparison */}
                <section>
                    <FacultyComparison 
                        comparison={safeData.faculty_comparison} 
                        personalMetrics={safeData.personal_metrics}
                    />
                </section>

                {/* Status Breakdown */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Submission Status</h2>
                    <StatusBreakdown breakdown={safeData.status_breakdown} />
                </section>

                {/* Recent Activity & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RecentActivity activities={safeData.recent_activity} />
                    <NotificationsPanel notifications={safeData.notifications} />
                </div>
            </div>
        </div>
    )
}
