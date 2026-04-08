import { Card, CardBody, CardHeader } from "@heroui/react"
import { FiAlertCircle } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../../../utils/helpers"

export const NotificationsPanel = ({ notifications }) => {
    const navigate = useNavigate()

    if (!notifications || notifications.length === 0) {
        return (
            <Card className="dark:bg-gray-800">
                <CardHeader>
                    <h3 className="text-lg font-semibold dark:text-gray-100">Notifications</h3>
                </CardHeader>
                <CardBody>
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No notifications</p>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card className="dark:bg-gray-800">
            <CardHeader>
                <h3 className="text-lg font-semibold dark:text-gray-100">Notifications</h3>
            </CardHeader>
            <CardBody className="gap-3">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        onClick={() => navigate("/student/notifications")}
                        className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                            <FiAlertCircle className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm dark:text-gray-100">{notification.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {formatDate(notification.created_at)}
                            </p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    )
}