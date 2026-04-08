import { Card, CardBody, CardHeader, Chip } from "@heroui/react"
import { formatDate, STATUS_COLORS } from "../../../../utils/helpers"
import { FiFileText } from "react-icons/fi"

export const RecentActivity = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return (
            <Card className="dark:bg-gray-800">
                <CardHeader>
                    <h3 className="text-lg font-semibold dark:text-gray-100">Recent Activity</h3>
                </CardHeader>
                <CardBody>
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent activity</p>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card className="dark:bg-gray-800">
            <CardHeader>
                <h3 className="text-lg font-semibold dark:text-gray-100">Recent Activity</h3>
            </CardHeader>
            <CardBody className="gap-3">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                            <FiFileText className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate dark:text-gray-100">{activity.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(activity.created_at)}
                            </p>
                        </div>
                        <Chip
                            color={STATUS_COLORS[activity.status]}
                            variant="flat"
                            size="sm"
                        >
                            {activity.status}
                        </Chip>
                    </div>
                ))}
            </CardBody>
        </Card>
    )
}